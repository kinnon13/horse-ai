import { Database } from '@/lib/supabase'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { ProducerHorse } from './ProducerHorseTypes'

async function getSupabaseClient() {
  const cookieStore = await cookies()
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name: string) => cookieStore.get(name)?.value } }
  )
}

export async function getProducerHorses(producerId: string): Promise<ProducerHorse[]> {
  const supabase = await getSupabaseClient()
  const { data: horses, error } = await supabase
    .from('producer_horses')
    .select('*')
    .eq('producer_id', producerId)
    .order('horse_name')

  if (error) throw new Error(`Failed to fetch producer horses: ${error.message}`)
  return horses || []
}

export async function createProducerHorse(horseData: Omit<ProducerHorse, 'id' | 'created_at' | 'updated_at'>): Promise<ProducerHorse> {
  const supabase = await getSupabaseClient()
  const { data: horse, error } = await supabase
    .from('producer_horses')
    .insert([horseData])
    .select()
    .single()

  if (error) throw new Error(`Failed to create horse: ${error.message}`)
  return horse
}

export async function updateProducerHorse(horseId: string, updateData: Partial<ProducerHorse>): Promise<ProducerHorse> {
  const supabase = await getSupabaseClient()
  const { data: horse, error } = await supabase
    .from('producer_horses')
    .update({
      ...updateData,
      updated_at: new Date().toISOString()
    })
    .eq('id', horseId)
    .select()
    .single()

  if (error) throw new Error(`Failed to update horse: ${error.message}`)
  return horse
}

export async function deleteProducerHorse(horseId: string): Promise<void> {
  const supabase = await getSupabaseClient()
  const { error } = await supabase
    .from('producer_horses')
    .delete()
    .eq('id', horseId)

  if (error) throw new Error(`Failed to delete horse: ${error.message}`)
}