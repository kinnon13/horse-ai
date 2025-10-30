import { supabase } from '@/lib/supabase'

interface Horse {
  id: string
  name: string
  sex: 'mare' | 'stud' | 'gelding' | 'filly' | 'colt' | 'unknown'
  year: string | null
  location_city: string | null
  location_state: string | null
}

export async function fetchUserHorses(userId: string): Promise<Horse[]> {
  try {
    const { data, error } = await supabase
      .from('user_horses')
      .select('id, name, sex, year, location_city, location_state')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching horses:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error fetching horses:', error)
    return []
  }
}

