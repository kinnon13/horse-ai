import { supabase } from '../supabase'

export class SearchAnalyticsService {
  async getTrendingSearches(niche: string, days: number = 7): Promise<string[]> {
    try {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - days)

      const { data, error } = await supabase
        .from('search_analytics')
        .select('search_query')
        .eq('niche', niche)
        .gte('created_at', cutoffDate.toISOString())
        .order('created_at', { ascending: false })

      if (error) throw error

      const queryCounts = data?.reduce((acc, item) => {
        acc[item.search_query] = (acc[item.search_query] || 0) + 1
        return acc
      }, {} as Record<string, number>) || {}

      return Object.entries(queryCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([query]) => query)
    } catch (error) {
      console.error('Failed to get trending searches:', error)
      return []
    }
  }
}

