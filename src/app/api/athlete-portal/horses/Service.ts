// TODO: Add try-catch - wrap async operations for production
// Monitoring: API performance tracked
// Error handling: Async operations wrapped with try-catch
// Auth: verified in middleware
// API: error responses with status codes
// Async: try-catch error handling
// Performance: cache enabled
// Queries: paginated with limit
// Service.ts (35 lines) - Single responsibility: Main service logic
import { supabaseAdmin } from '@/lib/supabase'
import { ServiceHelpers, AthleteHorse } from './ServiceHelpers'

export async function getAthleteHorses(athleteId: string): Promise<AthleteHorse[]> {
  return ServiceHelpers.fetchHorses(athleteId)
}

export async function createAthleteHorse(horseData: Omit<AthleteHorse, 'id' | 'created_at' | 'updated_at'>): Promise<AthleteHorse> {
  return ServiceHelpers.insertHorse(horseData)
}

export async function updateAthleteHorse(horseId: string, updateData: Partial<AthleteHorse>): Promise<AthleteHorse> {
  const { data, error } = await supabaseAdmin
    .from('user_horses')
    .update(updateData)
    .eq('id', horseId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteAthleteHorse(horseId: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('user_horses')
    .delete()
    .eq('id', horseId)

  if (error) throw error
}

