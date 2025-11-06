// determineStrategy.ts - Determine conversation strategy
export function determineStrategy(params: {
  emotion: string
  churnRisk: number
  engagement: number
  lifecycle: string
}) {
  const { emotion, churnRisk, engagement } = params
  
  if (churnRisk > 0.7 && engagement < 30) {
    return {
      recommendedStrategy: 'soft_nurture' as const,
      recommendedTone: 'empathetic' as const,
    }
  }
  
  if (emotion === 'excited' && churnRisk < 0.3) {
    return {
      recommendedStrategy: 'aggressive_convert' as const,
      recommendedTone: 'enthusiastic' as const,
    }
  }
  
  if (emotion === 'skeptical') {
    return {
      recommendedStrategy: 'build_trust' as const,
      recommendedTone: 'educational' as const,
    }
  }
  
  if (emotion === 'frustrated') {
    return {
      recommendedStrategy: 'problem_solve' as const,
      recommendedTone: 'supportive' as const,
    }
  }
  
  return {
    recommendedStrategy: 'discovery' as const,
    recommendedTone: 'neutral' as const,
  }
}

