import { supabase } from '@/lib/supabase'
import { HorseProfile } from './types'

export async function saveHorse(horse: HorseProfile, ownerId: string) {
  const { data, error } = await supabase
    .from('horse_profiles')
    .insert({
      ...horse,
      owner_id: ownerId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function updateHorse(horse: HorseProfile) {
  const { error } = await supabase
    .from('horse_profiles')
    .update({
      ...horse,
      updated_at: new Date().toISOString()
    })
    .eq('id', horse.id)
  
  if (error) throw error
}

export async function deleteHorse(horseId: string) {
  const { error } = await supabase
    .from('horse_profiles')
    .delete()
    .eq('id', horseId)
  
  if (error) throw error
}

