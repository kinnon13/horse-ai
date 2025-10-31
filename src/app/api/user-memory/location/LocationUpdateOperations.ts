// LocationUpdateOperations.ts (25 lines) - Location update operations
import { supabaseAdmin } from '@/lib/supabase'

export async function updateUserLocation(userId: string, locationData: any) {
  if (!supabaseAdmin) {
    throw new Error('Database not available')
  }

  const { data: user, error } = await supabaseAdmin
    .from('users')
    .update({
      location_city: locationData.city,
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

export async function optOutLocation(userId: string) {
  if (!supabaseAdmin) {
    throw new Error('Database not available')
  }

  const { data: user, error } = await supabaseAdmin
    .from('users')
    .update({
      location_opt_in: false,
      location_updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return user
}

