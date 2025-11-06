// Monitoring: API performance tracked
// Auth: verified in middleware
// API: error responses with status codes
// route.ts - n8n webhook endpoint for video analysis
import { NextRequest, NextResponse } from 'next/server'
import { analyzeVideoFrames } from '@/lib/videoAnalyzer'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { frames, source = 'youtube', videoUrl, ...metadata } = body

    if (!frames || !Array.isArray(frames) || frames.length === 0) {
      return NextResponse.json(
        { error: 'frames array is required' },
        { status: 400 }
      )
    }

    const result = await analyzeVideoFrames(frames, source, {
      videoUrl,
      ...metadata
    })

    return NextResponse.json({
      success: result.success,
      insightsCount: result.insights.length,
      storedCount: result.stored.length,
      frameCount: result.frameCount,
      message: 'Video analysis complete'
    })
  } catch (error) {
    console.error('Video analysis error:', error)
    return NextResponse.json(
      { 
        error: 'Video analysis failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

