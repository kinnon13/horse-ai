import { supabaseAdmin } from '@/lib/supabase'

export async function createProviderClaim(claimData: any) {
  const { data: claimRow, error } = await supabaseAdmin
    .from('provider_claims')
    .insert(claimData)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create provider claim: ${error.message}`)
  }

  return claimRow
}

export async function updateServiceRequestStatus(serviceRequestId: string, status: string) {
  const { error } = await supabaseAdmin
    .from('service_requests')
    .update({ status })
    .eq('id', serviceRequestId)

  if (error) {
    throw new Error(`Failed to update service request status: ${error.message}`)
  }
}

export async function getClaimDetails(claimId: string) {
  const { data: claimDetails, error } = await supabaseAdmin
    .from('provider_claims')
    .select('*')
    .eq('id', claimId)
    .single()

  if (error) {
    throw new Error(`Failed to get claim details: ${error.message}`)
  }

  return claimDetails
}

