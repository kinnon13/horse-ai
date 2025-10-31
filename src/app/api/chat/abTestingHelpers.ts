// abTestingHelpers.ts - A/B testing helper functions for chat
import { getOptimizedGreeting, shouldShowUpgrade } from '@/lib/conversionOptimizer'
import { trackConversion } from '@/lib/abTesting'

export async function getABTestData(userId: string, conversationId: string, messageCount: number) {
  // Get optimized greeting for first message
  let greeting = ''
  if (messageCount === 0) {
    greeting = await getOptimizedGreeting(userId, conversationId)
  }
  
  // Check if should show upgrade
  const upgradePrompt = await shouldShowUpgrade(conversationId, messageCount)
  
  return { greeting, upgradePrompt }
}

export async function trackChatEvent(conversationId: string, event: string, data?: any) {
  await trackConversion(conversationId, event, data)
}
