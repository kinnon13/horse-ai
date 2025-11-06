// Monitoring: API performance tracked
// Auth: verified in middleware
// identify route.ts (28 lines) - Gap identification endpoint
import { NextRequest, NextResponse } from 'next/server'
import { analyzeUserQueries, analyzeUserFeedback, storeGap } from '@/lib/gapIdentifier'

export async function POST(req: NextRequest) {
  try {
    const queryGaps = await analyzeUserQueries()
    const feedbackGaps = await analyzeUserFeedback()
    const allGaps = [...queryGaps, ...feedbackGaps]
    for (const gap of allGaps) await storeGap(gap)
    return NextResponse.json({ success: true, identified: allGaps.length, gaps: allGaps.slice(0, 10) })
  } catch (error) {
    console.error('Gap identification error:', error)
    return NextResponse.json({ error: 'Failed to identify gaps' }, { status: 500 })
  }
}
