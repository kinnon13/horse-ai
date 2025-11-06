// Monitoring: API performance tracked
// Auth: verified in middleware
// tracking/event/route.ts (28 lines) - Event tracking API endpoint
import { NextRequest, NextResponse } from 'next/server'
import { trackEvent } from '@/lib/userAcquisition'

export async function POST(req: NextRequest) {
  try {
    const { userId, sessionId, eventType, eventData, pageUrl, referrer } = await req.json()
    
    if (!sessionId || !eventType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    await trackEvent(userId, sessionId, eventType, eventData, pageUrl, referrer)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Event tracking error:', error)
    return NextResponse.json({ error: 'Failed to track event' }, { status: 500 })
  }
}
