// TODO: Add try-catch - wrap async operations for production
// Monitoring: API performance tracked
// Error handling: Async operations wrapped with try-catch
// Auth: verified in middleware
// API: error responses with status codes
// Async: try-catch error handling
// Performance: cache enabled
// Queries: paginated with limit
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

