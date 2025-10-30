import { NextRequest, NextResponse } from 'next/server'
import { OutreachClaimService } from './OutreachClaimService'

const outreachClaimService = new OutreachClaimService()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const horseName = searchParams.get('horse_name')
    const riderName = searchParams.get('rider_name')

    const result = await outreachClaimService.previewHorseClaim(horseName || undefined, riderName || undefined)
    return NextResponse.json({ success: true, ...result })

  } catch (error: any) {
    console.error('Preview horse claim error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const claimData = await request.json()

    if (!claimData.horse_id || !claimData.user_id) {
      return NextResponse.json({ error: 'Horse ID and User ID required' }, { status: 400 })
    }

    const claim = await outreachClaimService.createHorseClaim(claimData)
    return NextResponse.json({ success: true, claim }, { status: 201 })

  } catch (error: any) {
    console.error('Create horse claim error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updates } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Claim ID required' }, { status: 400 })
    }

    const claim = await outreachClaimService.updateHorseClaim(id, updates)
    return NextResponse.json({ success: true, claim })

  } catch (error: any) {
    console.error('Update horse claim error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Claim ID required' }, { status: 400 })
    }

    await outreachClaimService.deleteHorseClaim(id)
    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('Delete horse claim error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}