// smartRouter.ts (50 lines) - Psychology-optimized routing with all systems wired
import { generateEmbedding } from './embeddingService'
import { searchSimilar, storeEmbedding } from './vectorDB'
import { getTopRankedAI } from './aiRanking'
import { analyzeMultiDimensional } from '@/neo-brain/core/multiDimensionalAnalyzer'
import { analyzeEmotionalState } from '@/neo-brain/psychology/emotionalResonance'
import { generateContextualResponse } from '@/neo-brain/psychology/contextualInquiry'
import { injectEngagementTriggers } from '@/neo-brain/psychology/engagementOptimizer'
import { maximizeDecisionSupport } from '@/neo-brain/psychology/behavioralGuidance'
import { injectSharingHooks } from '@/neo-brain/social/viralEngine'
import { loadUserContext, buildPersonalizedGreeting } from '@/lib/hyperMemory'

export async function smartRoute(question: string, userId?: string, topic?: string) {
  const context = userId ? await loadUserContext(userId) : null
  const greeting = context ? buildPersonalizedGreeting(context) : null
  const dimensions = await analyzeMultiDimensional(question)
  const emotion = analyzeEmotionalState(question)
  const embedding = await generateEmbedding(question)
  const similar = await searchSimilar(embedding, 5)
  if (similar && similar.length > 0 && similar[0].similarity > 0.85) {
    const answer = similar[0].content
    const contextual = await generateContextualResponse(answer, context?.memory)
    const support = await maximizeDecisionSupport(question, context?.conversations)
    const hooks = injectSharingHooks({ response: answer, shareabilityScore: 8 })
    return { answer: `${greeting ? greeting + ' ' : ''}${answer}\n${contextual}\n${support.multiAngleAnalysis[0]}`, source: 'knowledge_core', confidence: similar[0].similarity, sources: similar.map((s: any) => ({ content: s.content, similarity: s.similarity })), hooks, triggers: injectEngagementTriggers({ conversationCount: context?.conversations?.length || 1 }) }
  }
  const topAI = await getTopRankedAI(topic)
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const response = await fetch(`${baseUrl}/api/ai/orchestrate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: question, userId, topic, preferredAI: topAI }) })
  const data = await response.json()
  if (data.response) {
    const contextual = await generateContextualResponse(data.response, context?.memory, dimensions)
    const support = await maximizeDecisionSupport(question, context?.conversations)
    const hooks = injectSharingHooks({ response: data.response, shareabilityScore: 8, viralPotential: true })
    const enhanced = `${greeting ? greeting + ' ' : ''}${data.response}\n${contextual}\n${support.multiAngleAnalysis[0]}`
    await storeEmbedding(enhanced, await generateEmbedding(enhanced), { question, provider: data.provider, confidence: 0.8, type: 'ai_response', user_id: userId }, userId)
    return { answer: enhanced, source: 'multi_ai', provider: data.provider, confidence: 0.8, hooks, triggers: injectEngagementTriggers({ conversationCount: context?.conversations?.length || 1 }), emotion }
  }
  return { answer: data.response || 'Sorry, I could not process that.', source: 'multi_ai', provider: data.provider }
}
