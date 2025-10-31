// engagementTriggers.ts - Engagement trigger generators

export interface EngagementTrigger {
  type: 'reward' | 'social' | 'scarcity' | 'authority' | 'reciprocity' | 'progress' | 'curiosity'
  message: string
}

export function generateVariableReward(): EngagementTrigger | null {
  if (Math.random() < 0.3) {
    return { type: 'reward', message: '🎁 Exclusive insight: Your training patterns match top Olympic riders' }
  }
  return null
}

export function generateSocialProof(): EngagementTrigger {
  return { type: 'social', message: `💬 ${Math.floor(Math.random() * 5000 + 1000)} barrel racers asked this today` }
}

export function generateScarcity(): EngagementTrigger {
  return { type: 'scarcity', message: '⏰ Only 3 premium spots left in this week\'s coaching cohort' }
}

export function generateAuthority(): EngagementTrigger {
  return { type: 'authority', message: '✅ Verified by 12 NFR champions and 3 Olympic trainers' }
}

export function generateProgress(convCount: number): EngagementTrigger | null {
  if (convCount > 0 && convCount % 10 === 0) {
    return { type: 'progress', message: `🏆 ${convCount}th conversation—you're becoming an expert!` }
  }
  return null
}

export function generateCuriosity(): EngagementTrigger {
  return { type: 'curiosity', message: '🔮 Tomorrow I\'ll share the barrel racing hack that helped 847 riders...' }
}
