import { supabase } from './supabase'
import { ExportFilters } from './export-generator'

export async function fetchHorses(userId: string, filters: ExportFilters) {
  let query = supabase
    .from('horses')
    .select('*')
    .eq('user_id', userId)
  
  if (filters.breed) query = query.eq('breed', filters.breed)
  if (filters.discipline) query = query.eq('discipline', filters.discipline)
  if (filters.minEarnings) query = query.gte('earnings', filters.minEarnings)
  if (filters.maxEarnings) query = query.lte('earnings', filters.maxEarnings)
  
  if (filters.dateRange) {
    query = query
      .gte('created_at', filters.dateRange.start)
      .lte('created_at', filters.dateRange.end)
  }
  
  const { data } = await query
  return data
}


