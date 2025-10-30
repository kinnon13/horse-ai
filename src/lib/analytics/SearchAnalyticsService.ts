import { supabase } from '../supabase'
import { SearchAnalytics } from './types'

export class SearchAnalyticsService {
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

  async getSearchHistory(userId: string, limit: number = 50): Promise<SearchAnalytics[]> {
    try {
      const { data, error } = await supabase
        .from('search_analytics')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error

      return data?.map(item => ({
        query: item.search_query,
        niche: item.niche,
        resultsCount: item.results_count,
        timestamp: new Date(item.created_at),
        userId: item.user_id
      })) || []
    } catch (error) {
      console.error('Failed to get search history:', error)
      return []
    }
  }
}