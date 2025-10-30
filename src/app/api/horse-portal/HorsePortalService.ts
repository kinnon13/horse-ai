import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { Database } from '@/lib/supabase'

export class HorsePortalService {
  private async getSupabaseClient() {
    const cookieStore = await cookies()
    return createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { get: (name: string) => cookieStore.get(name)?.value } }
    )
  }

  async getHorseOwnerProfile(userId: string) {
    const supabase = await this.getSupabaseClient()
    
    const { data: owner, error } = await supabase
      .from('horse_owners')
      .select(`
        *,
        horse_profiles (*)
      `)
      .eq('user_id', userId)
      .single()

    if (error) throw error
    return owner
  }

  async createHorseOwnerProfile(profileData: any) {
    const supabase = await this.getSupabaseClient()
    
    const { data: profile, error } = await supabase
      .from('horse_owners')
      .insert([profileData])
      .select()
      .single()

    if (error) throw error
    return profile
  }

  async updateHorseOwnerProfile(userId: string, updates: any) {
    const supabase = await this.getSupabaseClient()
    
    const { data: profile, error } = await supabase
      .from('horse_owners')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error
    return profile
  }

  async addHorseProfile(horseData: any) {
    const supabase = await this.getSupabaseClient()
    
    const { data: horse, error } = await supabase
      .from('horse_profiles')
      .insert([horseData])
      .select()
      .single()

    if (error) throw error
    return horse
  }

  async updateHorseProfile(horseId: string, updates: any) {
    const supabase = await this.getSupabaseClient()
    
    const { data: horse, error } = await supabase
      .from('horse_profiles')
      .update(updates)
      .eq('id', horseId)
      .select()
      .single()

    if (error) throw error
    return horse
  }

  async deleteHorseProfile(horseId: string) {
    const supabase = await this.getSupabaseClient()
    
    const { error } = await supabase
      .from('horse_profiles')
      .delete()
      .eq('id', horseId)

    if (error) throw error
    return { success: true }
  }
}

