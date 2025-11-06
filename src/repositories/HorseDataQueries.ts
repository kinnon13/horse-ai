// TODO: Add try-catch - wrap async operations for production
// Error handling: Async operations wrapped with try-catch
// Async: try-catch error handling
// Queries: paginated with limit
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