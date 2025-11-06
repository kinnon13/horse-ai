// Monitoring: API performance tracked
// Auth: verified in middleware
// route.ts - Chat API with smart routing (knowledge core first)
import { NextRequest, NextResponse } from 'next/server'
import { smartRoute } from '@/lib/smartRouter'
import { handleRateLimit, handleLeadCapture } from './route-handlers'
import { getABTestData } from './abTestingHelpers'
import { logAIInteraction, calculatePersonalizationScore } from '@/lib/ai-diagnostics/logger'

export async function POST(req: NextRequest) {
  const startTime = Date.now()
  try {
    const { message, userId, topic, conversationHistory } = await req.json()
    
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
    
    // Try smart router with conversation history, fallback to mock if it fails
    let result
    let contextBuilt: any = null
    let toolsUsed: string[] = []
    let emotionDetected: string | null = null
    let errorOccurred = false
    let errorMessage = ''
    
    try {
      result = await smartRoute(message, userId, topic, conversationHistory)
      
      // Extract diagnostics from result
      contextBuilt = null // Would come from vector DB context
      toolsUsed = [] // Would come from tool usage tracking
      emotionDetected = result.emotion?.state || null
    } catch (error) {
      errorOccurred = true
      errorMessage = error instanceof Error ? error.message : 'Unknown error'
      
      // 🚨 LOG THE ERROR SO YOU CAN SEE WHY IT FAILED
      console.error('🚨 AI SMART ROUTE FAILED:', errorMessage)
      console.error('Stack:', error)
      
      // Mock response for demo/testing when AI isn't configured
      result = {
        answer: `Great question about "${message}"! I'm currently in demo mode. Once you configure your AI API keys (Grok, OpenAI, Gemini), I'll provide expert answers about horses, training, breeding, health, and all equine topics. For now, I can confirm I'm working and ready to help once connected!`,
        source: 'demo_mode',
        provider: 'mock',
        confidence: 1.0,
        sources: []
      }
    }
    
    // Calculate personalization score
    const personalizedScore = calculatePersonalizationScore({
      contextBuilt,
      emotionDetected,
      toolsUsed,
      strategyUsed: 'smart_route',
      finalResponse: result.answer
    })
    
    // 🔍 LOG EVERYTHING FOR DIAGNOSTICS
    await logAIInteraction({
      userId: userId || 'anonymous',
      query: message,
      contextBuilt,
      toolsUsed,
      emotionDetected,
      strategyUsed: 'smart_route',
      responseProvider: result.provider || 'unknown',
      responseSource: result.source || 'unknown',
      finalResponse: result.answer,
      errorOccurred,
      errorMessage,
      personalizedScore,
      missedOpportunities: [],
      executionTimeMs: Date.now() - startTime
    })
    
    // Add to response (no fake greetings)
    const finalResponse = {
      message: result.answer,
      response: result.answer,
      source: result.source,
      provider: result.provider,
      confidence: result.confidence,
      sources: result.sources,
      remaining: rateLimitResponse.remaining - 1,
      limit: rateLimitResponse.limit,
      upgradePrompt: upgradePrompt.show ? upgradePrompt.message : null,
      // 🎯 ADD DIAGNOSTICS TO RESPONSE (for dashboard)
      diagnostics: {
        personalizedScore,
        toolsUsed,
        emotion: emotionDetected,
        contextAvailable: !!contextBuilt,
        errorOccurred
      }
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