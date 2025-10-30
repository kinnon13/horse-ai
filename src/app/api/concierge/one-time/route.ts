import { NextRequest, NextResponse } from 'next/server'
import { ConciergeOneTimeService } from './ConciergeOneTimeService'

const conciergeService = new ConciergeOneTimeService()

export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json()

    const result = await conciergeService.createConciergeRequest(requestData)
    return NextResponse.json({ success: true, ...result }, { status: 201 })

  } catch (error: any) {
    console.error('Concierge one-time error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const requests = await conciergeService.getConciergeRequests(userId)
    return NextResponse.json({ success: true, requests })

  } catch (error: any) {
    console.error('Get concierge requests error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updates } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Request ID required' }, { status: 400 })
    }

    const request = await conciergeService.updateConciergeRequest(id, updates)
    return NextResponse.json({ success: true, request })

  } catch (error: any) {
    console.error('Update concierge request error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}