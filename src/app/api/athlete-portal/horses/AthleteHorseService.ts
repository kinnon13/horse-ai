import { Database } from '@/lib/supabase'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { AthleteHorse } from './AthleteHorseTypes'

async function getSupabaseClient() {
  const cookieStore = await cookies()
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name: string) => cookieStore.get(name)?.value } }
  )
}

export async function getAthleteHorses(athleteId: string): Promise<AthleteHorse[]> {
  const supabase = await getSupabaseClient()
  const { data: horses, error } = await supabase
    .from('athlete_horses')
    .select('*')
    .eq('athlete_id', athleteId)
    .order('horse_name')

  if (error) throw new Error(`Failed to fetch athlete horses: ${error.message}`)
  return horses || []
}

export async function createAthleteHorse(horseData: Omit<AthleteHorse, 'id' | 'created_at' | 'updated_at'>): Promise<AthleteHorse> {
  const supabase = await getSupabaseClient()
  const { data: horse, error } = await supabase
    .from('athlete_horses')
    .insert([horseData])
    .select()
    .single()

  if (error) throw new Error(`Failed to create athlete horse: ${error.message}`)
  return horse
}

export async function updateAthleteHorse(horseId: string, horseData: Partial<AthleteHorse>): Promise<AthleteHorse> {
  const supabase = await getSupabaseClient()
  const { data: horse, error } = await supabase
    .from('athlete_horses')
    .update(horseData)
    .eq('id', horseId)
    .select()
    .single()

  if (error) throw new Error(`Failed to update athlete horse: ${error.message}`)
  return horse
}

export async function deleteAthleteHorse(horseId: string): Promise<void> {
  const supabase = await getSupabaseClient()
  const { error } = await supabase
    .from('athlete_horses')
    .delete()
    .eq('id', horseId)

  if (error) throw new Error(`Failed to delete athlete horse: ${error.message}`)
}