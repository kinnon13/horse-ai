import { NextRequest, NextResponse } from 'next/server'
import { WritingAssistanceService } from './WritingAssistanceService'

const writingService = new WritingAssistanceService()

export async function POST(request: NextRequest) {
  try {
    const { type, context, user_id, prompt } = await request.json()

    if (!type || !context || !user_id || !prompt) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await writingService.checkUserSubscription(user_id)
    const content = await writingService.generateContent(type, context, prompt)
    
    const session = await writingService.saveWritingSession(user_id, {
      type,
      context,
      prompt,
      generated_content: content
    })

    return NextResponse.json({ success: true, content, session })

  } catch (error: any) {
    console.error('Writing assistance error:', error)
    
    if (error.message.includes('Plus tier')) {
      return NextResponse.json({error: error.message,
        upgradeRequired: true 
      }, { status: 403 })
    }

    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')
    const sessionId = searchParams.get('session_id')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    if (sessionId) {
      const sessions = await writingService.getWritingSessions(userId)
      const session = sessions.find(s => s.id === sessionId)
      return NextResponse.json({ success: true, session })
    } else {
      const sessions = await writingService.getWritingSessions(userId)
      return NextResponse.json({ success: true, sessions })
    }

  } catch (error: any) {
    console.error('Get writing sessions error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { session_id, ...updates } = await request.json()

    if (!session_id) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 })
    }

    const session = await writingService.updateWritingSession(session_id, updates)
    return NextResponse.json({ success: true, session })

  } catch (error: any) {
    console.error('Update writing session error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 })
    }

    await writingService.deleteWritingSession(sessionId)
    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('Delete writing session error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}