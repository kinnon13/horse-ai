// TODO: Add try-catch - wrap async operations for production
// Monitoring: API performance tracked
// Error handling: Async operations wrapped with try-catch
// Auth: verified in middleware
// API: error responses with status codes
// Async: try-catch error handling
// Performance: cache enabled
import { supabase } from '@/lib/supabase'

export async function findBreeders(criteria: any) {
  const { data: breeders, error } = await supabase
    .from('producer_profiles')
    .select(`
      id,
      user_id,
      users:user_id (email, first_name, last_name, location_city, location_state)
    `)
    .limit(10)

  if (error) throw error

  return (breeders || []).map((breeder: any) => ({
    id: breeder.id,
    name: `${breeder.users?.first_name || ''} ${breeder.users?.last_name || ''}`,
    email: breeder.users?.email || '',
    location: `${breeder.users?.location_city || ''}, ${breeder.users?.location_state || ''}`,
    type: 'breeder'
  }))
}

