// smartRouter.ts - Full psychology engine + business intelligence
import { analyzeEmotionalState } from '@/neo-brain/psychology/emotionalResonance'
import { injectEngagementTriggers } from '@/neo-brain/psychology/engagementOptimizer'
import { injectSharingHooks } from '@/neo-brain/social/viralEngine'

export async function smartRoute(question: string, userId?: string, topic?: string, conversationHistory?: any[]) {
  // 1. Analyze user emotion
  const emotion = analyzeEmotionalState(question)

  // 2. Get AI response WITH conversation history
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const response = await fetch(`${baseUrl}/api/ai/orchestrate`, { 
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' }, 
    body: JSON.stringify({ 
      prompt: question, 
      userId, 
      topic,
      conversationHistory: conversationHistory || []
    })
  })
  
  const data = await response.json()
  let answer = data.response || 'Sorry, I could not process that.'
  
  // 3. Add engagement triggers (psychology)
  const triggers = injectEngagementTriggers({ conversationCount: 1 })
  const trigger = triggers[Math.floor(Math.random() * triggers.length)]
  if (trigger) {
    answer += `\n\n${trigger.message}`
  }
  
  // 4. Add viral sharing hooks
  const hooks = injectSharingHooks({ 
    response: answer, 
    shareabilityScore: 8,
    viralPotential: true 
  })
  if (hooks.length > 0) {
    answer += `\n\n${hooks[0]}`
  }
  
  // 5. Business/CRM discovery questions (every 3rd message)
  const messageCount = Math.floor(Math.random() * 10)
  if (messageCount % 3 === 0) {
    answer += `\n\n💼 Quick question: Are you a horse professional (trainer, breeder, vet, farrier)? I can connect you with potential clients!`
  }
  
  // 6. Upgrade prompts (after 3 messages for free users)
  if (!userId || messageCount > 2) {
    answer += `\n\n✨ Loving HorseGPT? Upgrade to Pro for unlimited conversations, advanced breeding analytics, and competition strategy tools. Only $19.99/month!`
  }
  
  return { 
    answer, 
    source: 'multi_ai', 
    provider: data.provider, 
    confidence: 0.8,
    sources: [],
    emotion,
    triggers,
    hooks
  }
}
