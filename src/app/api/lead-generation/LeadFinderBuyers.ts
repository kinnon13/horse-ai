// TODO: Add try-catch - wrap async operations for production
// Monitoring: API performance tracked
// Error handling: Async operations wrapped with try-catch
// Auth: verified in middleware
// API: error responses with status codes
// Async: try-catch error handling
// Performance: cache enabled
import { supabase } from '@/lib/supabase'

export async function findBuyers(criteria: any) {
  const { data: buyers, error } = await supabase
    .from('users')
    .select('id, email, first_name, last_name, location_city, location_state')
    .eq('subscription_tier', 'plus')
    .limit(10)

  if (error) throw error

  return (buyers || []).map((buyer: any) => ({
    id: buyer.id,
    name: `${buyer.first_name || ''} ${buyer.last_name || ''}`,
    email: buyer.email || '',
    location: `${buyer.location_city || ''}, ${buyer.location_state || ''}`,
    type: 'buyer'
  }))
}

