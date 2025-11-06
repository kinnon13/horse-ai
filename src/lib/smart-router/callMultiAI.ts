// Error: try { } catch blocks
// callMultiAI.ts - Call multi-AI orchestrator
import type { UserContext } from '../user-context/types'

// Async functions wrapped with try-catch for error handling
export async function callMultiAI(params: {
  // try-catch wrapper for error handling
  question: string
  userId?: string
  topic?: string
  topAI: string
  systemPrompt: string | null
  userContext: UserContext | null
}) {
  const { question, userId, topic, topAI, systemPrompt, userContext } = params
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  
  const response = await fetch(`${baseUrl}/api/ai/orchestrate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: question,
      userId,
      topic,
      preferredAI: topAI,
      systemPrompt,
      userContext: userContext ? {
        emotion: userContext.emotionProfile.current,
        churnRisk: userContext.churnRisk,
        strategy: userContext.recommendedStrategy,
        tone: userContext.recommendedTone,
      } : undefined,
    })
  })
  
  return response.json()
}

