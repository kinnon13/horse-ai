import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { Database } from '@/lib/supabase'

export class AthletePortalService {
  private async getSupabaseClient() {
    const cookieStore = await cookies()
    return createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { get: (name: string) => cookieStore.get(name)?.value } }
    )
  }

  async getAthleteProfile(userId: string) {
    const supabase = await this.getSupabaseClient()
    
    const { data: athlete, error } = await supabase
      .from('athlete_profiles')
      .select(`
        *,
        athlete_horses (*)
      `)
      .eq('user_id', userId)
      .single()

    if (error) throw error
    return athlete
  }

  async createAthleteProfile(profileData: any) {
    const supabase = await this.getSupabaseClient()
    
    const { data: profile, error } = await supabase
      .from('athlete_profiles')
      .insert([profileData])
      .select()
      .single()

    if (error) throw error
    return profile
  }

  async updateAthleteProfile(userId: string, updates: any) {
    const supabase = await this.getSupabaseClient()
    
    const { data: profile, error } = await supabase
      .from('athlete_profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error
    return profile
  }

  async addCompetitionHorse(horseData: any) {
    const supabase = await this.getSupabaseClient()
    
    const { data: horse, error } = await supabase
      .from('athlete_horses')
      .insert([horseData])
      .select()
      .single()

    if (error) throw error
    return horse
  }

  async updateCompetitionHorse(horseId: string, updates: any) {
    const supabase = await this.getSupabaseClient()
    
    const { data: horse, error } = await supabase
      .from('athlete_horses')
      .update(updates)
      .eq('id', horseId)
      .select()
      .single()

    if (error) throw error
    return horse
  }

  async deleteCompetitionHorse(horseId: string) {
    const supabase = await this.getSupabaseClient()
    
    const { error } = await supabase
      .from('athlete_horses')
      .delete()
      .eq('id', horseId)

    if (error) throw error
    return { success: true }
  }
}

