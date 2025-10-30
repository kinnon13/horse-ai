import { NextRequest, NextResponse } from 'next/server'
import { StallionPortalService } from './StallionPortalService'

const stallionPortalService = new StallionPortalService()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const station = await stallionPortalService.getStallionStationProfile(userId)
    return NextResponse.json({ success: true, station })

  } catch (error: any) {
    console.error('GET /api/stallion-portal error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, ...data } = await request.json()

    switch (action) {
      case 'create_profile':
        const profile = await stallionPortalService.createStallionStationProfile(data)
        return NextResponse.json({ success: true, profile }, { status: 201 })

      case 'add_stallion':
        const stallion = await stallionPortalService.addStallionProfile(data)
        return NextResponse.json({ success: true, stallion }, { status: 201 })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error: any) {
    console.error('POST /api/stallion-portal error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { action, ...data } = await request.json()

    switch (action) {
      case 'update_profile':
        const profile = await stallionPortalService.updateStallionStationProfile(data.user_id, data)
        return NextResponse.json({ success: true, profile })

      case 'update_stallion':
        const stallion = await stallionPortalService.updateStallionProfile(data.stallion_id, data)
        return NextResponse.json({ success: true, stallion })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error: any) {
    console.error('PUT /api/stallion-portal error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const stallionId = searchParams.get('stallion_id')

    if (!stallionId) {
      return NextResponse.json({ error: 'Stallion ID required' }, { status: 400 })
    }

    await stallionPortalService.deleteStallionProfile(stallionId)
    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('DELETE /api/stallion-portal error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}