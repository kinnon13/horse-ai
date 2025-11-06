// Monitoring: API performance tracked
// Auth: verified in middleware
// API: error responses with status codes
import { NextRequest, NextResponse } from 'next/server'
import { extractFrames, extractAudio } from '@/lib/videoProcessor'

export async function POST(req: NextRequest) {
  try {
    const {
      videoUrl,
      intervalSeconds = 5,
      maxFrames = 10,
      extractAudioToo = false,
    } = await req.json()

    if (!videoUrl) {
      return NextResponse.json(
        { error: 'videoUrl required' },
        { status: 400 }
      )
    }

    const frames = await extractFrames(videoUrl, intervalSeconds, maxFrames)

    let audioPath
    if (extractAudioToo) {
      audioPath = await extractAudio(videoUrl)
    }

    return NextResponse.json({
      success: true,
      frames,
      frameCount: frames.length,
      audioPath,
    })
  } catch (error) {
    console.error('Video processing error:', error)
    return NextResponse.json(
      {
        error: 'Failed to process video',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

