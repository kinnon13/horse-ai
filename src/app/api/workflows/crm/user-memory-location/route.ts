// Monitoring: API performance tracked
// Auth: verified in middleware
// user-memory-location/route.ts - Capture/update user geo
import { NextRequest, NextResponse } from 'next/server'
import { locationMemoryWorkflow } from './location.service'

export async function POST(req: NextRequest) {
  try {
    const { userId, location, context } = await req.json()
    
    if (!userId || !location) {
      return NextResponse.json({ error: 'Missing userId or location' }, { status: 400 })
    }

    const result = await locationMemoryWorkflow(userId, location, context)
    
    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error('Location memory error:', error)
    return NextResponse.json(
      { error: 'Location workflow failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

