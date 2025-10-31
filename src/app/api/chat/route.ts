// route.ts - Chat API with smart routing (knowledge core first)
import { NextRequest, NextResponse } from 'next/server'
import { smartRoute } from '@/lib/smartRouter'
import { handleRateLimit, handleLeadCapture } from './route-handlers'
import { getABTestData } from './abTestingHelpers'

export async function POST(req: NextRequest) {
  try {
    const { message, userId, topic } = await req.json()
    
    if (!message) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 })
    }
    const conversationId = `conv_${Date.now()}_${userId || 'anonymous'}`
    const messageCount = 0
    const { greeting, upgradePrompt } = await getABTestData(userId || 'anonymous', conversationId, messageCount)
    
    const rateLimitResponse = await handleRateLimit(userId || 'anonymous')
    if (rateLimitResponse instanceof NextResponse) {
      return rateLimitResponse
    }
    
    await handleLeadCapture(message, userId || 'anonymous')
    
    // Use smart router instead of direct AI call
    const result = await smartRoute(message, userId, topic)
    
    // Add to response
    const finalResponse = {
      response: result.answer + (greeting ? '\n\n' + greeting : ''),
      source: result.source,
      provider: result.provider,
      confidence: result.confidence,
      sources: result.sources,
      remaining: rateLimitResponse.remaining - 1,
      limit: rateLimitResponse.limit,
      upgradePrompt: upgradePrompt.show ? upgradePrompt.message : null
    }
    
    return NextResponse.json(finalResponse)
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { error: 'Chat failed', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    )
  }
}