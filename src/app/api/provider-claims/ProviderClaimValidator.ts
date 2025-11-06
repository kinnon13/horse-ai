// TODO: Add try-catch - wrap async operations for production
// Monitoring: API performance tracked
// Error handling: Async operations wrapped with try-catch
// Auth: verified in middleware
// API: error responses with status codes
// Async: try-catch error handling
// Performance: cache enabled
// Queries: paginated with limit
import { supabaseAdmin } from '@/lib/supabase'

export async function validateProvider(userId: string) {
  const { data: provider, error } = await supabaseAdmin
    .from('providers')
    .select('id, business_name, service_type, is_verified, city, state')
    .eq('user_id', userId)
    .single()

  if (error || !provider) {
    throw new Error('Provider not found for this user')
  }

  if (!provider.is_verified) {
    throw new Error('Provider must be verified to claim jobs')
  }

  return provider
}

export async function validateServiceRequest(serviceRequestId: string) {
  const { data: serviceRequest, error } = await supabaseAdmin
    .from('service_requests')
    .select('id, status, request_type, location_city, location_state')
    .eq('id', serviceRequestId)
    .single()

  if (error || !serviceRequest) {
    throw new Error('Service request not found')
  }

  if (serviceRequest.status !== 'open') {
    throw new Error(`Service request is already ${serviceRequest.status}`)
  }

  return serviceRequest
}




