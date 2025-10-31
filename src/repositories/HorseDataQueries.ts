// HorseDataQueries.ts (18 lines) - Single responsibility: Query methods
import { supabase } from '@/lib/supabase'

export interface Service {
  id: string
  name: string
  type: 'vet' | 'farrier' | 'trainer' | 'boarding'
  location: string
  phone: string
  rating: number
}

export async function searchServices(type: string, location: string): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('type', type)
    .ilike('location', `%${location}%`)
    .order('rating', { ascending: false })

  if (error) throw error
  return data || []
}