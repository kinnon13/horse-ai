import { Database } from '@/lib/supabase'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { StallionProfile } from './StallionProfileTypes'

async function getSupabaseClient() {
  const cookieStore = await cookies()
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name: string) => cookieStore.get(name)?.value } }
  )
}

export async function getStallionsByStation(stationId: string): Promise<StallionProfile[]> {
  const supabase = await getSupabaseClient()
  const { data: stallions, error } = await supabase
    .from('stallion_profiles')
    .select('*')
    .eq('station_id', stationId)
    .order('stallion_name')

  if (error) throw new Error(`Failed to fetch stallions: ${error.message}`)
  return stallions || []
}

export async function createStallionProfile(stallionData: Omit<StallionProfile, 'id' | 'created_at' | 'updated_at'>): Promise<StallionProfile> {
  const supabase = await getSupabaseClient()
  const { data: stallion, error } = await supabase
    .from('stallion_profiles')
    .insert([stallionData])
    .select()
    .single()

  if (error) throw new Error(`Failed to create stallion: ${error.message}`)
  return stallion
}

export async function updateStallionProfile(stallionId: string, stallionData: Partial<StallionProfile>): Promise<StallionProfile> {
  const supabase = await getSupabaseClient()
  const { data: stallion, error } = await supabase
    .from('stallion_profiles')
    .update(stallionData)
    .eq('id', stallionId)
    .select()
    .single()

  if (error) throw new Error(`Failed to update stallion: ${error.message}`)
  return stallion
}

export async function deleteStallionProfile(stallionId: string): Promise<void> {
  const supabase = await getSupabaseClient()
  const { error } = await supabase
    .from('stallion_profiles')
    .delete()
    .eq('id', stallionId)

  if (error) throw new Error(`Failed to delete stallion: ${error.message}`)
}