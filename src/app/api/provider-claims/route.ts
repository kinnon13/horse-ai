import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { validateProvider } from './ProviderClaimValidator'
import { createProviderClaim, updateServiceRequestStatus, getClaimDetails } from './ProviderClaimService'
import { scheduleAftercarePing } from '@/lib/aftercare'

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 })
    }

    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const provider = await validateProvider(userId)
    const body = await request.json()
    const { service_request_id, message, quoted_price } = body

    if (!service_request_id) {
      return NextResponse.json({ error: 'Missing required field: service_request_id' }, { status: 400 })
    }

    const serviceRequest = await validateServiceRequest(service_request_id)

    const claimData = {
      service_request_id,
      provider_id: provider.id,
      message: message || `I can handle this ${serviceRequest.request_type} request in ${serviceRequest.location_city}, ${serviceRequest.location_state}`,
      quoted_price: quoted_price || null,
      created_at: new Date().toISOString()
    }

    const claimRow = await createProviderClaim(claimData)
    await updateServiceRequestStatus(service_request_id, 'claimed')

    const claimDetails = await getClaimDetails(claimRow.id)

    await scheduleAftercarePing(service_request_id, 'provider_claimed')

    return NextResponse.json({
      success: true,
      claim: claimDetails
    })

  } catch (error) {
    console.error('❌ Provider claim error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}