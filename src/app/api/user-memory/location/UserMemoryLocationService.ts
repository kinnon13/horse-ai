import { supabaseAdmin } from '@/lib/supabase'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { Database } from '@/lib/supabase'

export class UserMemoryLocationService {
  private async getSupabaseClient() {
    const cookieStore = await cookies()
    return createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )
  }

  async getUserFromSession() {
    const supabase = await this.getSupabaseClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      throw new Error('Unauthorized')
    }
    
    return user
  }

  async updateUserLocation(userId: string, locationData: any) {
    if (!supabaseAdmin) {
      throw new Error('Database not available')
    }

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .update({location_city: locationData.city,
        location_state: locationData.state,
        location_lat: locationData.lat,
        location_lng: locationData.lng,
        location_opt_in: true,
        location_updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return user
  }

  async getUserLocation(userId: string) {
    if (!supabaseAdmin) {
      throw new Error('Database not available')
    }

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('location_city, location_state, location_lat, location_lng, location_opt_in')
      .eq('id', userId)
      .single()

    if (error) throw error
    return user
  }

  async optOutLocation(userId: string) {
    if (!supabaseAdmin) {
      throw new Error('Database not available')
    }

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .update({location_opt_in: false,
        location_updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return user
  }

  async saveLocationHistory(userId: string, locationData: any) {
    if (!supabaseAdmin) {
      throw new Error('Database not available')
    }

    const { data: history, error } = await supabaseAdmin
      .from('user_location_history')
      .insert([{user_id: userId,
        ...locationData,
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return history
  }
}

