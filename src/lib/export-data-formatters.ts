// export-data-formatters.ts (30 lines) - Single responsibility: Data formatting utilities
import { supabase } from './supabase'
import { ExportFilters } from './export-generator'

export async function fetchScrapedData(userId: string, filters: ExportFilters) {
  if (!filters.includeScrapedData) return []
  
  const { data } = await supabase
    .from('scraped_data')
    .select('*')
    .eq('user_id', userId)
  
  return data || []
}

export async function fetchLinkedEntities(userId: string, filters: ExportFilters) {
  if (!filters.includeLinkedEntities) return []
  
  const { data } = await supabase
    .from('linked_entities')
    .select('*')
    .eq('user_id', userId)
  
  return data || []
}

export async function fetchEvents(userId: string) {
  const { data } = await supabase
    .from('events')
    .select('*')
    .eq('user_id', userId)
  
  return data
}

export async function fetchSearchAnalytics(userId: string) {
  const { data } = await supabase
    .from('search_analytics')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(100)
  
  return data
}


