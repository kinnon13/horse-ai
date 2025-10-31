// engagementOptimizer.ts - Strategic engagement triggers for retention
import {
  generateVariableReward,
  generateSocialProof,
  generateScarcity,
  generateAuthority,
  generateProgress,
  generateCuriosity,
  type EngagementTrigger
} from './engagementTriggers'

export function injectEngagementTriggers(context: any): EngagementTrigger[] {
  const triggers: EngagementTrigger[] = []
  const reward = generateVariableReward()
  if (reward) triggers.push(reward)
  triggers.push(generateSocialProof())
  triggers.push(generateScarcity())
  triggers.push(generateAuthority())
  const progress = generateProgress(context.conversationCount || 1)
  if (progress) triggers.push(progress)
  triggers.push(generateCuriosity())
  return triggers
}

export function applyReciprocity(value: string): string {
  return `${value}\n\n🎁 Free bonus: Training tip from Martha Josey—${getRandomTip()}`
}

function getRandomTip(): string {
  const tips = [
    'Focus on smooth transitions between drums',
    'Trust your horse—let them find their pace',
    'Practice pattern work 15 minutes daily'
  ]
  return tips[Math.floor(Math.random() * tips.length)]
}
