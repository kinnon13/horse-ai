import { NextRequest, NextResponse } from 'next/server'
import { ProvidersService } from './ProvidersService'

const providersService = new ProvidersService()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filters = {serviceType: searchParams.get('service_type'),
      city: searchParams.get('city'),
      state: searchParams.get('state'),
      verified: searchParams.get('verified'),
      limit: parseInt(searchParams.get('limit') || '50')
    }

    const providers = await providersService.getProviders(filters)
    return NextResponse.json({ success: true, providers })

  } catch (error: any) {
    console.error('GET /api/providers error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const providerData = await request.json()

    if (!providerData.business_name || !providerData.service_type) {
      return NextResponse.json({ error: 'Business name and service type required' }, { status: 400 })
    }

    const provider = await providersService.createProvider(providerData)
    return NextResponse.json({ success: true, provider }, { status: 201 })

  } catch (error: any) {
    console.error('POST /api/providers error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updates } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Provider ID required' }, { status: 400 })
    }

    const provider = await providersService.updateProvider(id, updates)
    return NextResponse.json({ success: true, provider })

  } catch (error: any) {
    console.error('PUT /api/providers error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Provider ID required' }, { status: 400 })
    }

    await providersService.deleteProvider(id)
    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('DELETE /api/providers error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}