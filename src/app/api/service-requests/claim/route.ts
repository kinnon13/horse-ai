// Monitoring: API performance tracked
// Auth: verified in middleware
import { NextRequest, NextResponse } from 'next/server'
import { createProviderClaim, getServiceRequest, updateServiceRequestStatus, notifyUserOfClaim } from './ServiceRequestClaimService'
import { validateProviderClaim } from './ServiceRequestClaimValidator'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const claimData = validateProviderClaim(body)

    const serviceRequest = await getServiceRequest(claimData.service_request_id)
    
    if (serviceRequest.status !== 'open') {
      return NextResponse.json({ error: 'Service request is no longer available' }, { status: 400 })
    }

    const providerClaim = await createProviderClaim(claimData)
    await updateServiceRequestStatus(claimData.service_request_id, 'claimed')

    try {
      await notifyUserOfClaim(serviceRequest.user_id, 'Provider', 'service')
    } catch (notificationError) {
      console.warn('Failed to send notification:', notificationError)
    }

    return NextResponse.json({ 
      success: true, 
      claim: providerClaim,
      message: 'Provider claim created successfully' 
    }, { status: 201 })

  } catch (error) {
    console.error('POST /api/service-requests/claim error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Server error' 
    }, { status: 500 })
  }
}