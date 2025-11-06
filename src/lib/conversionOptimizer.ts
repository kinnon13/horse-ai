// TODO: Add try-catch - wrap async operations for production
// Error handling: Async operations wrapped with try-catch
// Async: try-catch error handling
// conversionOptimizer.ts - Optimized greeting & upgrade prompts
import { assignVariant, getWinningVariant } from './abTesting'

export async function getOptimizedGreeting(userId: string, conversationId: string) {
  // Disabled - only show greetings when we have REAL user data
  return ''
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
