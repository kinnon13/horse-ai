import { supabase } from '@/lib/supabase-client'

export async function claimServiceRequest(providerId: string, requestId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('provider_claims')
      .insert({
        provider_id: providerId,
        service_request_id: requestId,
        status: 'pending',
        claimed_at: new Date().toISOString(),
      })

    if (error) {
      throw error
    }

    await supabase.from('analytics_events').insert({
      event_type: 'provider_claimed',
      user_id: providerId,
      metadata: { requestId, claimedAt: new Date().toISOString() },
    })
  } catch (error) {
    console.error('Error claiming provider request:', error)
    throw error
  }
}



