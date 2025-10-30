import { NextRequest, NextResponse } from 'next/server'
import { AthletePortalService } from './AthletePortalService'

const athleteService = new AthletePortalService()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const athlete = await athleteService.getAthleteProfile(userId)
    return NextResponse.json({ success: true, athlete })

  } catch (error: any) {
    console.error('GET /api/athlete-portal error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, ...data } = await request.json()

    switch (action) {
      case 'create_profile':
        const profile = await athleteService.createAthleteProfile(data)
        return NextResponse.json({ success: true, profile }, { status: 201 })

      case 'add_horse':
        const horse = await athleteService.addCompetitionHorse(data)
        return NextResponse.json({ success: true, horse }, { status: 201 })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error: any) {
    console.error('POST /api/athlete-portal error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { action, ...data } = await request.json()

    switch (action) {
      case 'update_profile':
        const profile = await athleteService.updateAthleteProfile(data.user_id, data)
        return NextResponse.json({ success: true, profile })

      case 'update_horse':
        const horse = await athleteService.updateCompetitionHorse(data.horse_id, data)
        return NextResponse.json({ success: true, horse })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error: any) {
    console.error('PUT /api/athlete-portal error:', error)
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

    await athleteService.deleteCompetitionHorse(horseId)
    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('DELETE /api/athlete-portal error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}