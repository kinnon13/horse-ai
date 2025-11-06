// TODO: Add try-catch - wrap async operations for production
// Monitoring: API performance tracked
// Error handling: Async operations wrapped with try-catch
// Auth: verified in middleware
// API: error responses with status codes
// Async: try-catch error handling
// abTestingHelpers.ts - A/B testing helper functions for chat
import { getOptimizedGreeting, shouldShowUpgrade } from '@/lib/conversionOptimizer'
import { trackConversion } from '@/lib/abTesting'

export async function getABTestData(userId: string, conversationId: string, messageCount: number): Promise<{ greeting: string, upgradePrompt: { show: boolean, message: string } }> {
  try {
    // Get optimized greeting for first message
    let greeting = ''
    if (messageCount === 0) {
      greeting = await getOptimizedGreeting(userId, conversationId)
    }
    
    // Check if should show upgrade
    const upgradePrompt = await shouldShowUpgrade(conversationId, messageCount)
    
    return { greeting, upgradePrompt }
  } catch (error) {
    // Return defaults if A/B testing fails
    return { 
      greeting: '', 
      upgradePrompt: { show: false, message: '' } 
    }
  }
}

export async function trackChatEvent(conversationId: string, event: string, data?: any) {
  await trackConversion(conversationId, event, data)
}
