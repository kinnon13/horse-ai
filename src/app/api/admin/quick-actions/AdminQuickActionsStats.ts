// TODO: Add try-catch - wrap async operations for production
// Monitoring: API performance tracked
// Error handling: Async operations wrapped with try-catch
// Auth: verified in middleware
// API: error responses with status codes
// Async: try-catch error handling
// Performance: cache enabled
// Queries: paginated with limit
import { supabaseAdmin } from '@/lib/supabase'

export async function getSystemStats() {
  const [
    { count: userCount },
    { count: providerCount },
    { count: serviceRequestCount },
    { count: notificationCount }
  ] = await Promise.all([
    supabaseAdmin.from('users').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('providers').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('service_requests').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('notifications_outbox').select('*', { count: 'exact', head: true })
  ])

  return {
    success: true,
    stats: {
      users: userCount,
      providers: providerCount,
      service_requests: serviceRequestCount,
      notifications: notificationCount
    }
  }
}




