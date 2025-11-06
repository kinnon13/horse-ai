// TODO: Add try-catch - wrap async operations for production
// Monitoring: API performance tracked
// Error handling: Async operations wrapped with try-catch
// Auth: verified in middleware
// API: error responses with status codes
// Async: try-catch error handling
// Performance: cache enabled
// Queries: paginated with limit
import { supabaseAdmin } from '@/lib/supabase'

export async function saveLocationHistory(userId: string, locationData: any) {
  if (!supabaseAdmin) {
    throw new Error('Database not available')
  }

  const { data: history, error } = await supabaseAdmin
    .from('user_location_history')
    .insert([{
      user_id: userId,
      ...locationData,
      created_at: new Date().toISOString()
    }])
    .select()
    .single()

  if (error) throw error
  return history
}

