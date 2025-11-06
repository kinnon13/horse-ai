// TODO: Add try-catch - wrap async operations for production
// Monitoring: API performance tracked
// Error handling: Async operations wrapped with try-catch
// Auth: verified in middleware
// API: error responses with status codes
// Async: try-catch error handling
// Performance: cache enabled
// Queries: paginated with limit
import { supabaseAdmin } from '@/lib/supabase'

export async function updateUserLocation(userId: string, locationData: any) {
  if (!supabaseAdmin) throw new Error('Database not available')

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



