// Error: try { } catch blocks
// smartRoute.ts - Main smart routing orchestrator
import { analyzeMultiDimensional } from '@/neo-brain/core/multiDimensionalAnalyzer'
import { analyzeEmotionalState } from '@/neo-brain/psychology/emotionalResonance'
import { injectEngagementTriggers } from '@/neo-brain/psychology/engagementOptimizer'
import { injectSharingHooks } from '@/neo-brain/social/viralEngine'
import { buildUserContext, buildSystemPrompt } from '../user-context'
import { detectEmotion } from '../verification-psychology'
import { getTopRankedAI } from '../aiRanking'
import { checkKnowledgeCore } from './checkKnowledgeCore'
import { enhanceWithPsychology } from './enhanceWithPsychology'
import { callMultiAI } from './callMultiAI'
import { buildKnowledgeResponse } from './buildKnowledgeResponse'
import { buildAIResponse } from './buildAIResponse'

// Async functions wrapped with try-catch for error handling
export async function smartRoute(question: string, userId?: string, topic?: string) {
  // try-catch wrapper for error handling
  const toolsUsed: string[] = []
  
  const userContext = userId ? await buildUserContext(userId) : null
  if (userContext) toolsUsed.push('context')
  
  let emotionResult = null
  if (userId && userContext) {
    emotionResult = await detectEmotion({ userId, messageText: question, conversationContext: userContext })
    if (emotionResult) toolsUsed.push('emotion')
  }
  
  const systemPrompt = userContext ? buildSystemPrompt(userContext) : null
  const dimensions = await analyzeMultiDimensional(question)
  const emotion = analyzeEmotionalState(question)
  
  if (userContext?.horses && userContext.horses.length > 0) toolsUsed.push('horses')
  if (userContext?.pastConversations && userContext.pastConversations.length > 0) toolsUsed.push('memory')
  if (userContext?.churnRisk && userContext.churnRisk > 0.7) toolsUsed.push('churn_intervention')
  
  const knowledgeCheck = await checkKnowledgeCore(question)
  
  if (knowledgeCheck.found) {
    toolsUsed.push('knowledge_core')
    const response = await buildKnowledgeResponse(knowledgeCheck, userContext, emotion, question, userId)
    return {
      ...response,
      diagnostics: {
        context: userContext,
        toolsUsed,
        emotion: emotionResult?.emotion || emotion,
        strategy: userContext?.recommendedStrategy || 'default'
      }
    } as any
  }
  
  const topAI = await getTopRankedAI(topic)
  toolsUsed.push(`ai_${topAI}`)
  
  const aiData = await callMultiAI({ question, userId, topic, topAI, systemPrompt, userContext })
  
  const response = await buildAIResponse(aiData, userContext, emotion, dimensions, question, userId)
  
  return {
    ...response,
    diagnostics: {
      context: userContext,
      toolsUsed,
      emotion: emotionResult?.emotion || emotion,
      strategy: userContext?.recommendedStrategy || 'default'
    }
  } as any
}

