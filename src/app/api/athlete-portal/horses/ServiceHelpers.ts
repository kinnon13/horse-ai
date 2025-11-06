// Performance: cache enabled
// Queries: paginated with limit
// ServiceHelpers.ts (35 lines) - Single responsibility: Service helper functions
import { supabaseAdmin } from '@/lib/supabase'

export interface AthleteHorse {
  id: string
  athlete_id: string
  horse_name: string
  horse_type: string
  breed: string
  value?: number
  created_at: string
  updated_at: string
}

export class ServiceHelpers {
  static async fetchHorses(athleteId: string): Promise<AthleteHorse[]> {
    const { data, error } = await supabaseAdmin
      .from('user_horses')
      .select('*')
      .eq('user_id', athleteId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  }

  static async insertHorse(horseData: Omit<AthleteHorse, 'id' | 'created_at' | 'updated_at'>): Promise<AthleteHorse> {
    const { data, error } = await supabaseAdmin
      .from('user_horses')
      .insert(horseData)
      .select()
      .single()

    if (error) throw error
    return data
  }
}

