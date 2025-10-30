import { supabase } from '@/lib/supabase'

export interface UserHorse {
  id: string
  user_id: string
  horse_name: string
  horse_type: string
  breed: string
  value?: number
  created_at: string
  updated_at: string
}

export async function getUserHorses(userId: string): Promise<UserHorse[]> {
  const { data, error } = await supabase
    .from('user_horses')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function createUserHorse(horseData: Omit<UserHorse, 'id' | 'created_at' | 'updated_at'>): Promise<UserHorse> {
  const { data, error } = await supabase
    .from('user_horses')
    .insert(horseData)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateUserHorse(horseId: string, updateData: Partial<UserHorse>): Promise<UserHorse> {
  const { data, error } = await supabase
    .from('user_horses')
    .update(updateData)
    .eq('id', horseId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteUserHorse(horseId: string): Promise<void> {
  const { error } = await supabase
    .from('user_horses')
    .delete()
    .eq('id', horseId)

  if (error) throw error
}
