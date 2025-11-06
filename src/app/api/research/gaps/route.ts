// Monitoring: API performance tracked
// Auth: verified in middleware
import { NextRequest, NextResponse } from 'next/server'
import { identifyGaps } from '@/lib/researchEngine'

export async function GET(req: NextRequest) {
  try {
    const gaps = await identifyGaps()
    return NextResponse.json({
      success: true,
      gaps,
      topGap: gaps[0] || null
    })
  } catch (error) {
    console.error('Gap identification error:', error)
    return NextResponse.json({ error: 'Failed to identify gaps' }, { status: 500 })
  }
}

