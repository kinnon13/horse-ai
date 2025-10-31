// ProviderClaimResponseHandler.ts (25 lines) - Response creation and processing
import { NextResponse } from 'next/server'
import { createProviderClaim, updateServiceRequestStatus, getClaimDetails } from './ProviderClaimService'
import { scheduleAftercarePing } from '@/lib/aftercare'

export async function processProviderClaimResponse(
  serviceRequest: any,
  provider: any,
  message: string,
  quoted_price: any
) {
  const claimData = {
    service_request_id: serviceRequest.id,
    provider_id: provider.id,
    message: message || `I can handle this ${serviceRequest.request_type} request in ${serviceRequest.location_city}, ${serviceRequest.location_state}`,
    quoted_price: quoted_price || null,
    created_at: new Date().toISOString()
  }

  const claimRow = await createProviderClaim(claimData)
  await updateServiceRequestStatus(serviceRequest.id, 'claimed')
  const claimDetails = await getClaimDetails(claimRow.id)
  await scheduleAftercarePing(serviceRequest.id, 'provider_claimed')

  return NextResponse.json({
    success: true,
    claim: claimDetails
  })
}

