import { Database } from '@/lib/supabase'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

async function getSupabaseClient() {
  const cookieStore = await cookies()
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name: string) => cookieStore.get(name)?.value } }
  )
}

export async function verifyProducerOwnership(producerId: string, userId: string): Promise<boolean> {
  const supabase = await getSupabaseClient()
  const { data: producer, error } = await supabase
    .from('producer_profiles')
    .select('id')
    .eq('id', producerId)
    .eq('user_id', userId)
    .single()

  return !error && !!producer
}

export async function verifyHorseOwnership(horseId: string, userId: string): Promise<boolean> {
  const supabase = await getSupabaseClient()
  const { data: horse, error } = await supabase
    .from('producer_horses')
    .select(`
      *,
      producer_profiles!inner(user_id)
    `)
    .eq('id', horseId)
    .eq('producer_profiles.user_id', userId)
    .single()

  return !error && !!horse
}

