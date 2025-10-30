import { NextRequest, NextResponse } from 'next/server'
import { ClaimService } from './ClaimService'

const claimService = new ClaimService()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filters = {userId: searchParams.get('user_id'),
      horseId: searchParams.get('horse_id'),
      status: searchParams.get('status'),
      limit: parseInt(searchParams.get('limit') || '50')
    }

    const claims = await claimService.getClaims(filters)
    return NextResponse.json({ success: true, claims })

  } catch (error: any) {
    console.error('GET /api/claim error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const claimData = await request.json()

    if (!claimData.horse_id || !claimData.user_id) {
      return NextResponse.json({ error: 'Horse ID and User ID required' }, { status: 400 })
    }

    const claim = await claimService.createClaim(claimData)
    return NextResponse.json({ success: true, claim }, { status: 201 })

  } catch (error: any) {
    console.error('POST /api/claim error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updates } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Claim ID required' }, { status: 400 })
    }

    const claim = await claimService.updateClaim(id, updates)
    return NextResponse.json({ success: true, claim })

  } catch (error: any) {
    console.error('PUT /api/claim error:', error)
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

    await claimService.deleteClaim(id)
    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('DELETE /api/claim error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}