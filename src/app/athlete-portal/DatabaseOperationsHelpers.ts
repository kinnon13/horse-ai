// DatabaseOperationsHelpers.ts (30 lines)
import { supabase } from '@/lib/supabase'
import { CompetitionHorse } from './AthleteHorseTypes'
import { CompetitionEvent } from './AthleteEventTypes'

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

export async function deleteEventFromDatabase(eventId: string) {
  const { error } = await supabase
    .from('competition_events')
    .delete()
    .eq('id', eventId)
  
  if (error) throw error
}