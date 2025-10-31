// route.ts - Audio transcription API using OpenAI Whisper
import { NextRequest, NextResponse } from 'next/server'
import { processAudioInput, transcribeWithWhisper, validateAudioFile, AudioUpload } from './helpers'
import { checkRateLimit } from '@/lib/RateLimitService'

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 })

    const formData = await req.formData()
    const userId = formData.get('userId') as string
    const url = formData.get('url') as string | null
    const file = formData.get('file') as File | null

    if (!userId) return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    if (!file && !url) return NextResponse.json({ error: 'File or URL required' }, { status: 400 })

    const rateLimit = await checkRateLimit(userId)
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded', remaining: 0 }, { status: 429 })
    }

    const upload: AudioUpload = { file: file || undefined, url: url || undefined }
    const audioFile = await processAudioInput(upload)
    
    const validation = validateAudioFile(audioFile)
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const transcription = await transcribeWithWhisper(audioFile, apiKey)
    
    return NextResponse.json({
      success: true,
      transcription,
      remaining: rateLimit.remaining - 1,
      limit: rateLimit.limit
    })
  } catch (error) {
    console.error('Audio transcription error:', error)
    return NextResponse.json(
      { error: 'Transcription failed', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    )
  }
}
