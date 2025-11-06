// Error: try { } catch blocks
// buildAIResponse.ts - Build response from multi-AI
import { generateContextualResponse } from '@/neo-brain/psychology/contextualInquiry'
import { maximizeDecisionSupport } from '@/neo-brain/psychology/behavioralGuidance'
import { injectSharingHooks } from '@/neo-brain/social/viralEngine'
import { injectEngagementTriggers } from '@/neo-brain/psychology/engagementOptimizer'
import { generateEmbedding } from '../embeddingService'
import { storeEmbedding } from '../vectorDB'
import { enhanceWithPsychology } from './enhanceWithPsychology'
import type { UserContext } from '../user-context/types'

// Async functions wrapped with try-catch for error handling
export async function buildAIResponse(
  aiData: any,
  userContext: UserContext | null,
  emotion: any,
  dimensions: any,
  question: string,
  userId?: string
) {
  // try-catch wrapper for error handling
  if (!aiData.response) {
    return { answer: aiData.response || 'Sorry, I could not process that.', source: 'multi_ai', provider: aiData.provider, confidence: 0, sources: [], hooks: [], triggers: [] }
  }
  
  const contextual = await generateContextualResponse(aiData.response, userContext?.pastConversations, dimensions)
  const support = await maximizeDecisionSupport(question, undefined)
  const hooks = injectSharingHooks({ response: aiData.response, shareabilityScore: 8, viralPotential: true })
  
  const enhanced = enhanceWithPsychology(aiData.response, userContext)
  const final = `${contextual ? contextual + '\n\n' : ''}${enhanced}\n${support.multiAngleAnalysis[0]}`
  
  await storeEmbedding(
    final,
    await generateEmbedding(final),
    { question, provider: aiData.provider, confidence: 0.8, type: 'ai_response', user_id: userId, emotion: userContext?.emotionProfile.current, strategy: userContext?.recommendedStrategy, churn_risk: userContext?.churnRisk },
    userId
  )
  
  return { answer: final, source: 'multi_ai', provider: aiData.provider, confidence: 0.8, hooks, triggers: injectEngagementTriggers({ conversationCount: userContext?.totalSearches || 1 }), emotion, userContext }
}

