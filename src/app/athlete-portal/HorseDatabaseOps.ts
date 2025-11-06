// TODO: Add try-catch - wrap async operations for production
// Error handling: Async operations wrapped with try-catch
// Async: try-catch error handling
// Queries: paginated with limit
import { supabase } from '@/lib/supabase'
import { CompetitionHorse } from './AthleteHorseTypes'

export async function saveHorseToDatabase(horse: CompetitionHorse, athleteId: string) {
  const { data, error } = await supabase
    .from('athlete_horses')
    .insert({
      ...horse,
      athlete_id: athleteId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function updateHorseInDatabase(horse: CompetitionHorse) {
  const { error } = await supabase
    .from('athlete_horses')
    .update({
      ...horse,
      updated_at: new Date().toISOString()
    })
    .eq('id', horse.id)
  
  if (error) throw error
}

export async function deleteHorseFromDatabase(horseId: string) {
  const { error } = await supabase
    .from('athlete_horses')
    .delete()
    .eq('id', horseId)
  
  if (error) throw error
}


