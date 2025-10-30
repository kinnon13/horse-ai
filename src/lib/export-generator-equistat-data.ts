import { supabase } from './supabase'

export async function fetchEquiStatData(userId: string, horseName: string) {
  const { data: horse } = await supabase
    .from('horses')
    .select('*')
    .eq('name', horseName)
    .eq('user_id', userId)
    .single()

  if (!horse) {
    throw new Error('Horse not found')
  }

  const { data: scrapedData } = await supabase
    .from('scraped_data')
    .select('*')
    .eq('horse_name', horseName)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  return { horse, scrapedData }
}

