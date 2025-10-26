import { supabase } from './supabase'
import { GrokAPI } from './grok'

export interface SearchTrend {
  query: string
  frequency: number
  growth: number
  category: string
  suggestions: string[]
}

export interface FeatureSuggestion {
  feature: string
  demand: number
  implementation: string
  priority: 'high' | 'medium' | 'low'
}

export class SearchTrendsAnalyzer {
  private grok: GrokAPI

  constructor() {
    this.grok = new GrokAPI()
  }

  async analyzeSearchTrends(days: number = 7): Promise<SearchTrend[]> {
    try {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - days)

      // Get recent search analytics
      const { data: searches } = await supabase
        .from('search_analytics')
        .select('search_query, niche, created_at')
        .gte('created_at', cutoffDate.toISOString())
        .order('created_at', { ascending: false })

      if (!searches) return []

      // Analyze trends
      const trends = this.calculateTrends(searches)
      
      // Get AI insights on trends
      const aiInsights = await this.getAIInsights(trends)
      
      return aiInsights
    } catch (error) {
      console.error('Search trends analysis error:', error)
      return []
    }
  }

  private calculateTrends(searches: any[]): SearchTrend[] {
    const queryCounts = new Map<string, number>()
    const queryCategories = new Map<string, string>()
    const queryTimestamps = new Map<string, number[]>()

    // Count queries and track timestamps
    searches.forEach(search => {
      const query = search.search_query.toLowerCase()
      queryCounts.set(query, (queryCounts.get(query) || 0) + 1)
      queryCategories.set(query, search.niche)
      
      if (!queryTimestamps.has(query)) {
        queryTimestamps.set(query, [])
      }
      queryTimestamps.get(query)!.push(new Date(search.created_at).getTime())
    })

    // Calculate trends
    const trends: SearchTrend[] = []
    
    queryCounts.forEach((frequency, query) => {
      const timestamps = queryTimestamps.get(query) || []
      const growth = this.calculateGrowth(timestamps)
      
      trends.push({
        query,
        frequency,
        growth,
        category: queryCategories.get(query) || 'general',
        suggestions: this.generateSuggestions(query)
      })
    })

    return trends.sort((a, b) => b.frequency - a.frequency)
  }

  private calculateGrowth(timestamps: number[]): number {
    if (timestamps.length < 2) return 0

    const midPoint = Math.floor(timestamps.length / 2)
    const firstHalf = timestamps.slice(0, midPoint).length
    const secondHalf = timestamps.slice(midPoint).length

    if (firstHalf === 0) return 100
    return ((secondHalf - firstHalf) / firstHalf) * 100
  }

  private generateSuggestions(query: string): string[] {
    const suggestions: string[] = []
    
    // Generate related suggestions based on query
    if (query.includes('breeding')) {
      suggestions.push('breeding combinations', 'sire analysis', 'dam performance')
    }
    if (query.includes('performance')) {
      suggestions.push('race results', 'earnings analysis', 'speed ratings')
    }
    if (query.includes('health')) {
      suggestions.push('vaccination records', 'injury tracking', 'veterinary care')
    }

    return suggestions.slice(0, 3)
  }

  private async getAIInsights(trends: SearchTrend[]): Promise<SearchTrend[]> {
    try {
      const prompt = `Analyze these search trends and provide insights:
      
      Trends: ${JSON.stringify(trends.slice(0, 10))}
      
      Provide:
      1. Enhanced suggestions for each trend
      2. Identify emerging patterns
      3. Suggest new features based on search behavior
      
      Return as JSON array with enhanced trend data.`

      const response = await this.grok.query([
        { role: 'system', content: 'You are an expert at analyzing search trends and suggesting product features.' },
        { role: 'user', content: prompt }
      ])

      // Parse AI response and enhance trends
      const aiData = JSON.parse(response)
      return trends.map(trend => ({
        ...trend,
        suggestions: [...trend.suggestions, ...(aiData.suggestions || [])]
      }))
    } catch (error) {
      console.error('AI insights error:', error)
      return trends
    }
  }

  async generateFeatureSuggestions(): Promise<FeatureSuggestion[]> {
    try {
      const trends = await this.analyzeSearchTrends(30)
      
      const prompt = `Based on these search trends, suggest new features:
      
      Trends: ${JSON.stringify(trends.slice(0, 20))}
      
      Suggest features that would address these search patterns:
      1. Feature name
      2. Demand level (1-10)
      3. Implementation approach
      4. Priority level
      
      Return as JSON array of feature suggestions.`

      const response = await this.grok.query([
        { role: 'system', content: 'You are a product manager analyzing user search behavior to suggest new features.' },
        { role: 'user', content: prompt }
      ])

      const aiSuggestions = JSON.parse(response)
      
      return aiSuggestions.map((suggestion: any) => ({
        feature: suggestion.feature,
        demand: suggestion.demand,
        implementation: suggestion.implementation,
        priority: suggestion.priority
      }))
    } catch (error) {
      console.error('Feature suggestion error:', error)
      return []
    }
  }

  async getTopSearches(limit: number = 10): Promise<string[]> {
    try {
      const { data: searches } = await supabase
        .from('search_analytics')
        .select('search_query')
        .order('created_at', { ascending: false })
        .limit(1000)

      if (!searches) return []

      // Count query frequency
      const queryCounts = new Map<string, number>()
      searches.forEach(search => {
        const query = search.search_query.toLowerCase()
        queryCounts.set(query, (queryCounts.get(query) || 0) + 1)
      })

      // Sort by frequency and return top queries
      return Array.from(queryCounts.entries())
        .sort(([,a], [,b]) => b - a)
        .slice(0, limit)
        .map(([query]) => query)
    } catch (error) {
      console.error('Top searches error:', error)
      return []
    }
  }
}
