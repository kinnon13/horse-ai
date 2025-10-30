import { supabaseAdmin } from '@/lib/supabase'

export interface AthleteHorse {
  id: string
  athlete_id: string
  horse_name: string
  horse_type: string
  breed: string
  value?: number
  created_at: string
  updated_at: string
}

export async function getAthleteHorses(athleteId: string): Promise<AthleteHorse[]> {
  const { data, error } = await supabaseAdmin
    .from('user_horses')
    .select('*')
    .eq('user_id', athleteId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function createAthleteHorse(horseData: Omit<AthleteHorse, 'id' | 'created_at' | 'updated_at'>): Promise<AthleteHorse> {
  const { data, error } = await supabaseAdmin
    .from('user_horses')
    .insert(horseData)
    .select()
    .single()

  if (error) throw error
  return data
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