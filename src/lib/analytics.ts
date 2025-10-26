import { supabase } from './supabase'
import { GrokAPI } from './grok'

export interface SearchAnalytics {
  query: string
  niche: string
  resultsCount: number
  timestamp: Date
  userId: string
}

export interface NicheInsights {
  niche: string
  trendingSearches: string[]
  popularHorses: string[]
  topOwners: string[]
  topRiders: string[]
  earningsTrends: {
    year: number
    total: number
    average: number
  }[]
  breedingInsights: {
    topSires: string[]
    topDams: string[]
    successfulCrosses: string[]
  }
}

export class AnalyticsEngine {
  private grok: GrokAPI

  constructor() {
    this.grok = new GrokAPI()
  }

  async trackSearch(query: string, niche: string, resultsCount: number, userId: string) {
    try {
      await supabase
        .from('search_analytics')
        .insert({
          user_id: userId,
          search_query: query,
          niche,
          results_count: resultsCount,
          created_at: new Date().toISOString()
        })
    } catch (error) {
      console.error('Failed to track search:', error)
    }
  }

  async getNicheInsights(niche: string, userId?: string): Promise<NicheInsights> {
    try {
      // Get search analytics for niche
      let query = supabase
        .from('search_analytics')
        .select('*')
        .eq('niche', niche)
        .order('created_at', { ascending: false })
        .limit(100)

      if (userId) {
        query = query.eq('user_id', userId)
      }

      const { data: searches } = await query

      // Get horse data for niche
      const { data: horses } = await supabase
        .from('horses')
        .select('*')
        .eq('discipline', niche)
        .order('earnings', { ascending: false })
        .limit(50)

      // Analyze trends with AI
      const trendAnalysis = await this.analyzeTrends(searches || [], horses || [])

      return {
        niche,
        trendingSearches: this.getTrendingSearches(searches || []),
        popularHorses: horses?.slice(0, 10).map(h => h.name) || [],
        topOwners: this.getTopOwners(horses || []),
        topRiders: this.getTopRiders(horses || []),
        earningsTrends: this.calculateEarningsTrends(horses || []),
        breedingInsights: trendAnalysis.breeding
      }
    } catch (error) {
      console.error('Failed to get niche insights:', error)
      return this.getDefaultInsights(niche)
    }
  }

  async getTopSearches(userId?: string, limit: number = 10): Promise<string[]> {
    try {
      let query = supabase
        .from('search_analytics')
        .select('search_query, results_count')
        .order('created_at', { ascending: false })
        .limit(1000)

      if (userId) {
        query = query.eq('user_id', userId)
      }

      const { data: searches } = await query

      if (!searches) return []

      // Group by query and count occurrences
      const queryCounts = searches.reduce((acc: { [key: string]: number }, search) => {
        acc[search.search_query] = (acc[search.search_query] || 0) + 1
        return acc
      }, {})

      // Sort by count and return top queries
      return Object.entries(queryCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, limit)
        .map(([query]) => query)
    } catch (error) {
      console.error('Failed to get top searches:', error)
      return []
    }
  }

  async getTrendingTopics(days: number = 7): Promise<{ topic: string, growth: number }[]> {
    try {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - days)

      const { data: recentSearches } = await supabase
        .from('search_analytics')
        .select('search_query, created_at')
        .gte('created_at', cutoffDate.toISOString())

      const { data: olderSearches } = await supabase
        .from('search_analytics')
        .select('search_query, created_at')
        .lt('created_at', cutoffDate.toISOString())
        .gte('created_at', new Date(cutoffDate.getTime() - days * 24 * 60 * 60 * 1000).toISOString())

      const recentCounts = this.countQueries(recentSearches || [])
      const olderCounts = this.countQueries(olderSearches || [])

      // Calculate growth rates
      const trends = Object.keys(recentCounts).map(query => {
        const recent = recentCounts[query] || 0
        const older = olderCounts[query] || 0
        const growth = older > 0 ? ((recent - older) / older) * 100 : 100
        
        return { topic: query, growth }
      })

      return trends
        .sort((a, b) => b.growth - a.growth)
        .slice(0, 10)
    } catch (error) {
      console.error('Failed to get trending topics:', error)
      return []
    }
  }

  async generateInsights(userId: string): Promise<string> {
    try {
      const insights = await this.getNicheInsights('all', userId)
      const topSearches = await this.getTopSearches(userId, 5)
      const trending = await this.getTrendingTopics(7)

      const prompt = `Analyze this equine data and provide insights:
      
      Top Searches: ${topSearches.join(', ')}
      Trending Topics: ${trending.map(t => `${t.topic} (+${t.growth.toFixed(1)}%)`).join(', ')}
      Popular Horses: ${insights.popularHorses.slice(0, 5).join(', ')}
      Top Owners: ${insights.topOwners.slice(0, 5).join(', ')}
      
      Provide actionable insights for breeding, training, and business decisions.`

      const response = await this.grok.query([
        { role: 'system', content: 'You are an expert equine data analyst providing actionable insights.' },
        { role: 'user', content: prompt }
      ])

      return response
    } catch (error) {
      console.error('Failed to generate insights:', error)
      return 'Unable to generate insights at this time.'
    }
  }

  private async analyzeTrends(searches: any[], horses: any[]): Promise<{ breeding: any }> {
    try {
      const prompt = `Analyze these equine trends:
      
      Searches: ${searches.map(s => s.search_query).join(', ')}
      Horses: ${horses.map(h => `${h.name} (${h.sire} × ${h.dam})`).join(', ')}
      
      Identify:
      - Top performing sires
      - Successful dam lines
      - Popular breeding combinations
      - Emerging trends
      
      Format as JSON.`

      const response = await this.grok.query([
        { role: 'system', content: 'You are an expert at analyzing equine breeding trends.' },
        { role: 'user', content: prompt }
      ])

      // Parse AI response for breeding insights
      const breedingInsights = {
        topSires: this.extractSires(horses),
        topDams: this.extractDams(horses),
        successfulCrosses: this.extractCrosses(horses)
      }

      return { breeding: breedingInsights }
    } catch (error) {
      console.error('Failed to analyze trends:', error)
      return { breeding: { topSires: [], topDams: [], successfulCrosses: [] } }
    }
  }

  private getTrendingSearches(searches: any[]): string[] {
    const queryCounts = searches.reduce((acc: { [key: string]: number }, search) => {
      acc[search.search_query] = (acc[search.search_query] || 0) + 1
      return acc
    }, {})

    return Object.entries(queryCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([query]) => query)
  }

  private getTopOwners(horses: any[]): string[] {
    const ownerCounts = horses.reduce((acc: { [key: string]: number }, horse) => {
      if (horse.owner_name) {
        acc[horse.owner_name] = (acc[horse.owner_name] || 0) + 1
      }
      return acc
    }, {})

    return Object.entries(ownerCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([owner]) => owner)
  }

  private getTopRiders(horses: any[]): string[] {
    const riderCounts = horses.reduce((acc: { [key: string]: number }, horse) => {
      if (horse.rider_name) {
        acc[horse.rider_name] = (acc[horse.rider_name] || 0) + 1
      }
      return acc
    }, {})

    return Object.entries(riderCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([rider]) => rider)
  }

  private calculateEarningsTrends(horses: any[]): any[] {
    // Group by year and calculate totals
    const yearData: { [key: number]: { total: number, count: number } } = {}
    
    horses.forEach(horse => {
      const year = new Date(horse.created_at).getFullYear()
      if (!yearData[year]) {
        yearData[year] = { total: 0, count: 0 }
      }
      yearData[year].total += horse.earnings || 0
      yearData[year].count += 1
    })

    return Object.entries(yearData)
      .map(([year, data]) => ({
        year: parseInt(year),
        total: data.total,
        average: data.total / data.count
      }))
      .sort((a, b) => a.year - b.year)
  }

  private countQueries(searches: any[]): { [key: string]: number } {
    return searches.reduce((acc: { [key: string]: number }, search) => {
      acc[search.search_query] = (acc[search.search_query] || 0) + 1
      return acc
    }, {})
  }

  private extractSires(horses: any[]): string[] {
    const sireCounts = horses.reduce((acc: { [key: string]: number }, horse) => {
      if (horse.sire) {
        acc[horse.sire] = (acc[horse.sire] || 0) + 1
      }
      return acc
    }, {})

    return Object.entries(sireCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([sire]) => sire)
  }

  private extractDams(horses: any[]): string[] {
    const damCounts = horses.reduce((acc: { [key: string]: number }, horse) => {
      if (horse.dam) {
        acc[horse.dam] = (acc[horse.dam] || 0) + 1
      }
      return acc
    }, {})

    return Object.entries(damCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([dam]) => dam)
  }

  private extractCrosses(horses: any[]): string[] {
    const crossCounts = horses.reduce((acc: { [key: string]: number }, horse) => {
      if (horse.sire && horse.dam) {
        const cross = `${horse.sire} × ${horse.dam}`
        acc[cross] = (acc[cross] || 0) + 1
      }
      return acc
    }, {})

    return Object.entries(crossCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([cross]) => cross)
  }

  private getDefaultInsights(niche: string): NicheInsights {
    return {
      niche,
      trendingSearches: [],
      popularHorses: [],
      topOwners: [],
      topRiders: [],
      earningsTrends: [],
      breedingInsights: {
        topSires: [],
        topDams: [],
        successfulCrosses: []
      }
    }
  }
}
