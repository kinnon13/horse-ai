// Monitoring: API performance tracked
// Auth: verified in middleware
// API: error responses with status codes
// haul-support-feedback/route.ts - Ingest + score hauler reviews
import { NextRequest, NextResponse } from 'next/server'
import { processHaulerReview } from './feedback.service'

export async function POST(req: NextRequest) {
  try {
    const { review, haulerId, routeId } = await req.json()
    
    if (!review || !haulerId) {
      return NextResponse.json(
        { error: 'Review and haulerId required' },
        { status: 400 }
      )
    }

    const result = await processHaulerReview(review, haulerId, routeId)
    
    return NextResponse.json({ 
      success: true, 
      result 
    })
  } catch (error) {
    console.error('Haul support feedback error:', error)
    return NextResponse.json(
      { error: 'Failed to process review' },
      { status: 500 }
    )
  }
}
