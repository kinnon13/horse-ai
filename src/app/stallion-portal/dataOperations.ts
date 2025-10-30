import { supabase } from '@/lib/supabase'
import { StallionProfile } from './types'

export async function saveStallion(stallion: StallionProfile, stationId: string) {
  const { data, error } = await supabase
    .from('stallion_profiles')
    .insert({
      ...stallion,
      station_id: stationId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function updateStallion(stallion: StallionProfile) {
  const { error } = await supabase
    .from('stallion_profiles')
    .update({
      ...stallion,
      updated_at: new Date().toISOString()
    })
    .eq('id', stallion.id)
  
  if (error) throw error
}

export async function deleteStallion(stallionId: string) {
  const { error } = await supabase
    .from('stallion_profiles')
    .delete()
    .eq('id', stallionId)
  
  if (error) throw error
}

