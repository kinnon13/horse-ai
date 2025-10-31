// emotionalResonance.ts (48 lines) - Emotional engagement optimization engine
export type EmotionalState = 'fear' | 'worry' | 'excitement' | 'confusion' | 'neutral'
export type ResonanceTrigger = 'reassurance' | 'amplify' | 'authority' | 'social_proof'
export interface EmotionalAnalysis {
  state: EmotionalState
  intensity: number
  confidence: number
}

export function analyzeEmotionalState(input: string): EmotionalAnalysis {
  const lowerInput = input.toLowerCase()
  const indicators = {
    fear: ['scared', 'worried', 'afraid', 'nervous', 'anxious'],
    worry: ['concern', 'problem', 'issue', 'trouble', 'difficult'],
    excitement: ['excited', 'awesome', 'great', 'love', 'amazing'],
    confusion: ['confused', 'unclear', 'understand', 'explain', 'how']
  }
  const scores = {
    fear: indicators.fear.filter(w => lowerInput.includes(w)).length,
    worry: indicators.worry.filter(w => lowerInput.includes(w)).length,
    excitement: indicators.excitement.filter(w => lowerInput.includes(w)).length,
    confusion: indicators.confusion.filter(w => lowerInput.includes(w)).length
  }
  const maxScore = Math.max(...Object.values(scores))
  const state = maxScore > 0 ? Object.keys(scores).find(k => scores[k as keyof typeof scores] === maxScore) as EmotionalState : 'neutral'
  return {
    state,
    intensity: maxScore / 5,
    confidence: maxScore > 0 ? Math.min(maxScore / 3, 1) : 0.1
  }
}

export function selectResonanceTrigger(state: EmotionalState): ResonanceTrigger {
  const triggerMap: Record<EmotionalState, ResonanceTrigger> = {
    fear: 'reassurance',
    worry: 'authority',
    excitement: 'amplify',
    confusion: 'reassurance',
    neutral: 'social_proof'
  }
  return triggerMap[state]
}

export function calculateOptimalEngagementTiming(intensity: number): number {
  const baseDelay = 500
  const intensityFactor = intensity > 0.7 ? 200 : intensity > 0.4 ? 400 : 600
  return baseDelay + intensityFactor
}
