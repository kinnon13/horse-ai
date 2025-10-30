import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { Database } from '@/lib/supabase'

export class StallionPortalService {
  private async getSupabaseClient() {
    const cookieStore = await cookies()
    return createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { get: (name: string) => cookieStore.get(name)?.value } }
    )
  }

  async getStallionStationProfile(userId: string) {
    const supabase = await this.getSupabaseClient()
    
    const { data: station, error } = await supabase
      .from('stallion_stations')
      .select(`
        *,
        stallion_profiles (*)
      `)
      .eq('user_id', userId)
      .single()

    if (error) throw error
    return station
  }

  async createStallionStationProfile(profileData: any) {
    const supabase = await this.getSupabaseClient()
    
    const { data: profile, error } = await supabase
      .from('stallion_stations')
      .insert([profileData])
      .select()
      .single()

    if (error) throw error
    return profile
  }

  async updateStallionStationProfile(userId: string, updates: any) {
    const supabase = await this.getSupabaseClient()
    
    const { data: profile, error } = await supabase
      .from('stallion_stations')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error
    return profile
  }

  async addStallionProfile(stallionData: any) {
    const supabase = await this.getSupabaseClient()
    
    const { data: stallion, error } = await supabase
      .from('stallion_profiles')
      .insert([stallionData])
      .select()
      .single()

    if (error) throw error
    return stallion
  }

  async updateStallionProfile(stallionId: string, updates: any) {
    const supabase = await this.getSupabaseClient()
    
    const { data: stallion, error } = await supabase
      .from('stallion_profiles')
      .update(updates)
      .eq('id', stallionId)
      .select()
      .single()

    if (error) throw error
    return stallion
  }

  async deleteStallionProfile(stallionId: string) {
    const supabase = await this.getSupabaseClient()
    
    const { error } = await supabase
      .from('stallion_profiles')
      .delete()
      .eq('id', stallionId)

    if (error) throw error
    return { success: true }
  }
}

