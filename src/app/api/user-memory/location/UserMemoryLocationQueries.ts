// UserMemoryLocationQueries.ts (30 lines) - Database queries
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
