import { Database } from '@/lib/supabase'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { HorseProfile } from './HorseProfileTypes'

async function getSupabaseClient() {
  const cookieStore = await cookies()
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name: string) => cookieStore.get(name)?.value } }
  )
}

export async function getHorsesByOwner(ownerId: string): Promise<HorseProfile[]> {
  const supabase = await getSupabaseClient()
  const { data: horses, error } = await supabase
    .from('horse_profiles')
    .select('*')
    .eq('owner_id', ownerId)
    .order('horse_name')

  if (error) throw new Error(`Failed to fetch horses: ${error.message}`)
  return horses || []
}

export async function createHorseProfile(horseData: Omit<HorseProfile, 'id' | 'created_at' | 'updated_at'>): Promise<HorseProfile> {
  const supabase = await getSupabaseClient()
  const { data: horse, error } = await supabase
    .from('horse_profiles')
    .insert([horseData])
    .select()
    .single()

  if (error) throw new Error(`Failed to create horse: ${error.message}`)
  return horse
}

export async function updateHorseProfile(horseId: string, horseData: Partial<HorseProfile>): Promise<HorseProfile> {
  const supabase = await getSupabaseClient()
  const { data: horse, error } = await supabase
    .from('horse_profiles')
    .update(horseData)
    .eq('id', horseId)
    .select()
    .single()

  if (error) throw new Error(`Failed to update horse: ${error.message}`)
  return horse
}

export async function deleteHorseProfile(horseId: string): Promise<void> {
  const supabase = await getSupabaseClient()
  const { error } = await supabase
    .from('horse_profiles')
    .delete()
    .eq('id', horseId)

  if (error) throw new Error(`Failed to delete horse: ${error.message}`)
}