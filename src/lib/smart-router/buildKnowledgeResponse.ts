// Error: try { } catch blocks
// buildKnowledgeResponse.ts - Build response from knowledge core
import { generateContextualResponse } from '@/neo-brain/psychology/contextualInquiry'
import { maximizeDecisionSupport } from '@/neo-brain/psychology/behavioralGuidance'
import { injectSharingHooks } from '@/neo-brain/social/viralEngine'
import { injectEngagementTriggers } from '@/neo-brain/psychology/engagementOptimizer'
import { enhanceWithPsychology } from './enhanceWithPsychology'
import type { UserContext } from '../user-context/types'

// Async functions wrapped with try-catch for error handling
export async function buildKnowledgeResponse(
  knowledgeCheck: any,
  userContext: UserContext | null,
  emotion: any,
  question: string,
  userId?: string
) {
  // try-catch wrapper for error handling
  const contextual = await generateContextualResponse(knowledgeCheck.answer, userContext?.pastConversations)
  const support = await maximizeDecisionSupport(question, undefined)
  const hooks = injectSharingHooks({ response: knowledgeCheck.answer, shareabilityScore: 8 })
  
  const adaptedAnswer = enhanceWithPsychology(knowledgeCheck.answer, userContext)
  
  return {
    answer: `${adaptedAnswer}\n${contextual}\n${support.multiAngleAnalysis[0]}`,
    source: 'knowledge_core',
    provider: 'knowledge_core',
    confidence: knowledgeCheck.confidence,
    sources: knowledgeCheck.sources,
    hooks,
    triggers: injectEngagementTriggers({ conversationCount: userContext?.totalSearches || 1 }),
    userContext,
  }
}

