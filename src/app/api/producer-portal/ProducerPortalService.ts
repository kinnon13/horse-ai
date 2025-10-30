import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { Database } from '@/lib/supabase'

export class ProducerPortalService {
  private async getSupabaseClient() {
    const cookieStore = await cookies()
    return createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { get: (name: string) => cookieStore.get(name)?.value } }
    )
  }

  async getProducerProfile(userId: string) {
    const supabase = await this.getSupabaseClient()
    
    const { data: producer, error } = await supabase
      .from('producer_profiles')
      .select(`
        *,
        producer_horses (*)
      `)
      .eq('user_id', userId)
      .single()

    if (error) throw error
    return producer
  }

  async createProducerProfile(profileData: any) {
    const supabase = await this.getSupabaseClient()
    
    const { data: profile, error } = await supabase
      .from('producer_profiles')
      .insert([profileData])
      .select()
      .single()

    if (error) throw error
    return profile
  }

  async updateProducerProfile(userId: string, updates: any) {
    const supabase = await this.getSupabaseClient()
    
    const { data: profile, error } = await supabase
      .from('producer_profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error
    return profile
  }

  async addProducerHorse(horseData: any) {
    const supabase = await this.getSupabaseClient()
    
    const { data: horse, error } = await supabase
      .from('producer_horses')
      .insert([horseData])
      .select()
      .single()

    if (error) throw error
    return horse
  }

  async updateProducerHorse(horseId: string, updates: any) {
    const supabase = await this.getSupabaseClient()
    
    const { data: horse, error } = await supabase
      .from('producer_horses')
      .update(updates)
      .eq('id', horseId)
      .select()
      .single()

    if (error) throw error
    return horse
  }

  async deleteProducerHorse(horseId: string) {
    const supabase = await this.getSupabaseClient()
    
    const { error } = await supabase
      .from('producer_horses')
      .delete()
      .eq('id', horseId)

    if (error) throw error
    return { success: true }
  }
}

