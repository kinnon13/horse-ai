import { supabaseAdmin } from '@/lib/supabase'
import { ServiceRequest, ProviderClaim } from './ServiceRequestClaimTypes'

export async function getServiceRequest(requestId: string): Promise<ServiceRequest> {
  if (!supabaseAdmin) throw new Error('Database not available')

  const { data: serviceRequest, error } = await supabaseAdmin
    .from('service_requests')
    .select('status, user_id')
    .eq('id', requestId)
    .single()

  if (error || !serviceRequest) throw new Error('Service request not found')
  return { id: requestId, ...serviceRequest }
}

export async function createProviderClaim(claimData: Omit<ProviderClaim, 'id' | 'created_at' | 'updated_at'>): Promise<ProviderClaim> {
  if (!supabaseAdmin) throw new Error('Database not available')

  const { data: providerClaim, error } = await supabaseAdmin
    .from('provider_claims')
    .insert({
      ...claimData,
      created_at: new Date().toISOString()
    })
    .select()
    .single()

  if (error) throw new Error(`Failed to create provider claim: ${error.message}`)
  return providerClaim
}

export async function updateServiceRequestStatus(requestId: string, status: string): Promise<void> {
  if (!supabaseAdmin) throw new Error('Database not available')

  const { error } = await supabaseAdmin
    .from('service_requests')
    .update({
      status,
      updated_at: new Date().toISOString()
    })
    .eq('id', requestId)

  if (error) throw new Error(`Failed to update service request: ${error.message}`)
}

export async function notifyUserOfClaim(userId: string, providerName: string, serviceType: string): Promise<void> {
  if (!supabaseAdmin) throw new Error('Database not available')

  const { error } = await supabaseAdmin
    .from('notifications_outbox')
    .insert({
      user_id: userId,
      type: 'service_claim',
      title: 'New Service Provider Response',
      message: `${providerName} has responded to your ${serviceType} request`,
      status: 'pending',
      created_at: new Date().toISOString()
    })

  if (error) throw new Error(`Failed to create notification: ${error.message}`)
}