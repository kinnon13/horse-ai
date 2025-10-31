// LocationQueryOperations.ts (20 lines) - Location query operations
import { supabaseAdmin } from '@/lib/supabase'

export async function getUserLocation(userId: string) {
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

