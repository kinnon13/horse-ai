import { supabase } from './supabase'
import { ExportData, ExportFilters } from './export-generator'
import { fetchHorses } from './export-generator-data-horses'

export async function gatherExportData(userId: string, filters: ExportFilters): Promise<ExportData> {
  const horses = await fetchHorses(userId, filters)
  const scrapedData = await fetchScrapedData(userId, filters)
  const linkedEntities = await fetchLinkedEntities(userId, filters)
  const events = await fetchEvents(userId)
  const searchAnalytics = await fetchSearchAnalytics(userId)
  
  return {
    horses: horses || [],
    events: events || [],
    scrapedData,
    linkedEntities,
    searchAnalytics: searchAnalytics || []
  }
}

async function fetchScrapedData(userId: string, filters: ExportFilters) {
  if (!filters.includeScrapedData) return []
  
  const { data } = await supabase
    .from('scraped_data')
    .select('*')
    .eq('user_id', userId)
  
  return data || []
}

async function fetchLinkedEntities(userId: string, filters: ExportFilters) {
  if (!filters.includeLinkedEntities) return []
  
  const { data } = await supabase
    .from('linked_entities')
    .select('*')
    .eq('user_id', userId)
  
  return data || []
}

async function fetchEvents(userId: string) {
  const { data } = await supabase
    .from('events')
    .select('*')
    .eq('user_id', userId)
  
  return data
}

async function fetchSearchAnalytics(userId: string) {
  const { data } = await supabase
    .from('search_analytics')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(100)
  
  return data
}

