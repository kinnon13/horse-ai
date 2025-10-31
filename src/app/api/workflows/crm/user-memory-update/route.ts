// user-memory-update/route.ts - Save prefs from chats/uploads
import { NextRequest, NextResponse } from 'next/server'
import { memoryUpdateWorkflow } from './memory.service'

export async function POST(req: NextRequest) {
  try {
    const { userId, preferences, metadata } = await req.json()
    
    if (!userId || !preferences) {
      return NextResponse.json({ error: 'Missing userId or preferences' }, { status: 400 })
    }

    const result = await memoryUpdateWorkflow(userId, preferences, metadata)
    
    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error('Memory update error:', error)
    return NextResponse.json(
      { error: 'Memory update failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

