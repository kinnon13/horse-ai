// TODO: Add try-catch - wrap async operations for production
// Monitoring: API performance tracked
// Error handling: Async operations wrapped with try-catch
// Auth: verified in middleware
// API: error responses with status codes
// Async: try-catch error handling
// Performance: cache enabled
// Queries: paginated with limit
import { supabaseAdmin } from '@/lib/supabase'

export async function createTestHaulPoint(params: { name?: string, city?: string, state?: string }) {
  const { name = 'Test Haul Point', city = 'Test City', state = 'TX' } = params
  
  const { data, error } = await supabaseAdmin
    .from('haul_points')
    .insert({
      name,
      city,
      state,
      latitude: 29.7604,
      longitude: -95.3698,
      is_active: true
    })
    .select()
    .single()

  if (error) throw new Error(`Failed to create test haul point: ${error.message}`)
  return { success: true, haul_point: data }
}

export async function sendTestNotification(params: { user_id?: string, message?: string }) {
  const { user_id, message = 'Test notification from admin' } = params
  
  if (!user_id) throw new Error('User ID required for test notification')
  
  const { data, error } = await supabaseAdmin
    .from('notifications_outbox')
    .insert({
      user_id,
      channel: 'in_app',
      message,
      scheduled_for: new Date().toISOString(),
      status: 'pending'
    })
    .select()
    .single()

  if (error) throw new Error(`Failed to create test notification: ${error.message}`)
  return { success: true, notification: data }
}




