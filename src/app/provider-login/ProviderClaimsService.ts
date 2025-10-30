import { Provider } from './ProviderLoginTypes'
import { supabase } from '@/lib/supabase'

export async function claimServiceRequest(providerId: string, requestId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('provider_claims')
      .insert({
        provider_id: providerId,
        service_request_id: requestId,
        status: 'pending'
      })

    if (error) throw error
    
    // Log analytics event
    console.log('PROVIDER_CLAIM_REQUEST', {
      provider_id: providerId,
      service_request_id: requestId,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error claiming request:', error)
    throw error
  }
}

