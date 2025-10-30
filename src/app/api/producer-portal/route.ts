import { NextRequest, NextResponse } from 'next/server'
import { ProducerPortalService } from './ProducerPortalService'

const producerPortalService = new ProducerPortalService()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const producer = await producerPortalService.getProducerProfile(userId)
    return NextResponse.json({ success: true, producer })

  } catch (error: any) {
    console.error('GET /api/producer-portal error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, ...data } = await request.json()

    switch (action) {
      case 'create_profile':
        const profile = await producerPortalService.createProducerProfile(data)
        return NextResponse.json({ success: true, profile }, { status: 201 })

      case 'add_horse':
        const horse = await producerPortalService.addProducerHorse(data)
        return NextResponse.json({ success: true, horse }, { status: 201 })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error: any) {
    console.error('POST /api/producer-portal error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { action, ...data } = await request.json()

    switch (action) {
      case 'update_profile':
        const profile = await producerPortalService.updateProducerProfile(data.user_id, data)
        return NextResponse.json({ success: true, profile })

      case 'update_horse':
        const horse = await producerPortalService.updateProducerHorse(data.horse_id, data)
        return NextResponse.json({ success: true, horse })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error: any) {
    console.error('PUT /api/producer-portal error:', error)
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

    await producerPortalService.deleteProducerHorse(horseId)
    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('DELETE /api/producer-portal error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}