import { NextRequest, NextResponse } from 'next/server'
import { HorsePortalService } from './HorsePortalService'

const horsePortalService = new HorsePortalService()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const owner = await horsePortalService.getHorseOwnerProfile(userId)
    return NextResponse.json({ success: true, owner })

  } catch (error: any) {
    console.error('GET /api/horse-portal error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, ...data } = await request.json()

    switch (action) {
      case 'create_profile':
        const profile = await horsePortalService.createHorseOwnerProfile(data)
        return NextResponse.json({ success: true, profile }, { status: 201 })

      case 'add_horse':
        const horse = await horsePortalService.addHorseProfile(data)
        return NextResponse.json({ success: true, horse }, { status: 201 })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error: any) {
    console.error('POST /api/horse-portal error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { action, ...data } = await request.json()

    switch (action) {
      case 'update_profile':
        const profile = await horsePortalService.updateHorseOwnerProfile(data.user_id, data)
        return NextResponse.json({ success: true, profile })

      case 'update_horse':
        const horse = await horsePortalService.updateHorseProfile(data.horse_id, data)
        return NextResponse.json({ success: true, horse })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error: any) {
    console.error('PUT /api/horse-portal error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const horseId = searchParams.get('horse_id')

    if (!horseId) {
      return NextResponse.json({ error: 'Horse ID required' }, { status: 400 })
    }

    await horsePortalService.deleteHorseProfile(horseId)
    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('DELETE /api/horse-portal error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}