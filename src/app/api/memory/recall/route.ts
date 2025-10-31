// memory/recall/route.ts (35 lines) - Get personalized greeting from user memories
import { NextRequest, NextResponse } from 'next/server'
import { recallUserMemories } from '@/lib/memoryRecall'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }
    
    const greeting = await recallUserMemories(userId)
    
    return NextResponse.json({ greeting })
  } catch (error: any) {
    console.error('Memory recall error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
