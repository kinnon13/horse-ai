import { NextRequest, NextResponse } from 'next/server'
import { ServiceRequestsService } from './ServiceRequestsService'

const serviceRequestsService = new ServiceRequestsService()

export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json()

    if (!requestData.request_type || !requestData.details) {
      return NextResponse.json({ error: 'Request type and details required' }, { status: 400 })
    }

    const serviceRequest = await serviceRequestsService.createServiceRequest(requestData)
    const dispatchResult = await serviceRequestsService.dispatchToProviders(serviceRequest)

    return NextResponse.json({success: true, 
      serviceRequest,
      dispatch: dispatchResult
    }, { status: 201 })

  } catch (error: any) {
    console.error('POST /api/service-requests error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filters = {userId: searchParams.get('userId'),
      status: searchParams.get('status'),
      requestType: searchParams.get('requestType'),
      limit: parseInt(searchParams.get('limit') || '50')
    }

    const requests = await serviceRequestsService.getServiceRequests(filters)
    return NextResponse.json({ success: true, requests })

  } catch (error: any) {
    console.error('GET /api/service-requests error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updates } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Request ID required' }, { status: 400 })
    }

    const request = await serviceRequestsService.updateServiceRequest(id, updates)
    return NextResponse.json({ success: true, request })

  } catch (error: any) {
    console.error('PUT /api/service-requests error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Request ID required' }, { status: 400 })
    }

    await serviceRequestsService.deleteServiceRequest(id)
    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('DELETE /api/service-requests error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}