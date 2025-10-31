// conversionOptimizer.ts - Optimized greeting & upgrade prompts
import { assignVariant, getWinningVariant } from './abTesting'

export async function getOptimizedGreeting(userId: string, conversationId: string) {
  const variant = await assignVariant(userId, conversationId, 'greeting')
  const greetings = {
    A: "Hey! I'm HorseGPT. Ask me anything about horses.",
    B: "I just analyzed 1,000 barrel runs today. Want me to look at yours?",
    C: "Welcome! I remember analyzing runs at 50 events this week."
  }
  return greetings[variant as keyof typeof greetings] || greetings.A
}

export async function shouldShowUpgrade(conversationId: string, messageCount: number) {
  const variant = await getWinningVariant('pitch_timing')
  const timings = { A: 1, B: 3, C: 5 }
  const threshold = timings[variant as keyof typeof timings] || 3
  
  if (messageCount < threshold) return { show: false, message: '' }
  
  const styleVariant = await getWinningVariant('pitch_style')
  const styles = {
    A: "Upgrade for $20/mo to unlock full analysis.",
    B: "Top barrel racers use premium—want to see what they see? $20/mo",
    C: "Upgrade to premium ($20/mo) for personalized insights."
  }
  return { show: true, message: styles[styleVariant as keyof typeof styles] || styles.A }
}
