import { supabase } from '@/lib/supabase'

interface Horse {
  id: string
  name: string
  sex: 'mare' | 'stud' | 'gelding' | 'filly' | 'colt' | 'unknown'
  year: string | null
  location_city: string | null
  location_state: string | null
}

export async function addUserHorse(userId: string, horseData: Omit<Horse, 'id'>): Promise<Horse | null> {
  try {
    const { data, error } = await supabase
      .from('user_horses')
      .insert({
        user_id: userId,
        name: horseData.name,
        sex: horseData.sex,
        year: horseData.year,
        location_city: horseData.location_city,
        location_state: horseData.location_state
      })
      .select()
      .single()

    if (error) {
      console.error('Error adding horse:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error adding horse:', error)
    return null
  }
}

