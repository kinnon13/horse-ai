// enhanceWithPsychology.ts - Add psychology-based enhancements
import type { UserContext } from '../user-context/types'

export function enhanceWithPsychology(answer: string, userContext: UserContext | null): string {
  if (!userContext) return answer
  
  let enhanced = answer
  
  if (userContext.recommendedStrategy === 'aggressive_convert') {
    enhanced += '\n\n💎 Ready to unlock premium features? Upgrade now for unlimited searches and direct business contacts!'
  } else if (userContext.recommendedStrategy === 'soft_nurture') {
    enhanced += '\n\n📚 Want to learn more? I have tons of resources to help you.'
  } else if (userContext.recommendedStrategy === 'build_trust' && userContext.ownsBusinessProbability > 0.6) {
    enhanced += '\n\n📊 Did you know? Verified businesses rank 3x higher in our searches.'
  } else if (userContext.horses.length > 0 && !userContext.horses[0].verified) {
    enhanced += `\n\n🐴 I see you have ${userContext.horses[0].name} registered. Want me to help verify their information?`
  }
  
  return enhanced
}

