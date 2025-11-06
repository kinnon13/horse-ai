// buildSystemPrompt.ts - Build AI system prompt from context
import { UserContext } from './types'
import { getStrategyInstructions } from './getStrategyInstructions'

export function buildSystemPrompt(context: UserContext): string {
  return `You are a highly personalized AI assistant for ${context.userName || 'this user'}.

COMPLETE USER PROFILE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EMOTIONAL STATE:
- Current: ${context.emotionProfile.current} (${(context.emotionProfile.confidence * 100).toFixed(0)}% confident)
- Dominant: ${context.emotionProfile.dominant.join(', ')}

LIFECYCLE & ENGAGEMENT:
- Stage: ${context.lifecycleStage} (${context.daysSinceSignup} days)
- Engagement: ${context.engagementScore}/100 (${context.engagementTrend})
- Searches: ${context.totalSearches}

CHURN RISK:
- Probability: ${(context.churnRisk * 100).toFixed(0)}%
- Factors: ${context.riskFactors.join(', ') || 'None'}
- Intervention: ${context.interventionNeeded ? 'YES' : 'No'}

CONVERSION:
- Stage: ${context.conversionStage}
- Subscribed: ${context.hasSubscription ? 'YES (' + context.subscriptionTier + ')' : 'No'}

BUSINESS INTELLIGENCE:
- Owns Business: ${(context.ownsBusinessProbability * 100).toFixed(0)}% likely

HORSES:
${context.horses.length > 0 ? context.horses.map(h => `- ${h.name} (${h.breed || 'Unknown'}) ${h.verified ? '✓' : ''}`).join('\n') : '- None'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STRATEGY: ${context.recommendedStrategy.toUpperCase()}
TONE: ${context.recommendedTone.toUpperCase()}

${getStrategyInstructions(context.recommendedStrategy)}

Adapt based on this psychological profile.`
}

