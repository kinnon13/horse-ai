// viralEngine.ts - Turn satisfied users into brand advocates through organic sharing

interface SharingContext {
  shareabilityScore?: number
  response?: string
  isPremium?: boolean
  viralPotential?: boolean
}

export function injectSharingHooks(context: SharingContext): string[] {
  const hooks: string[] = []

  if (context.shareabilityScore && context.shareabilityScore > 7) {
    hooks.push('📸 Screenshot-worthy! Share with your barn friends?')
  }

  if (context.viralPotential && context.response) {
    hooks.push(`🔥 HOT TAKE: ${context.response.substring(0, 100)}... (Tag someone who needs this)`)
  }

  if (context.isPremium) {
    hooks.push('💎 Premium members get insights like this daily')
  } else {
    hooks.push('🎁 Invite 3 friends → unlock advanced features FREE')
  }

  return hooks
}

export function calculateShareabilityScore(response: string, userTier: string): number {
  let score = 0
  if (response.length > 100) score += 2
  if (response.includes('!') || response.includes('?')) score += 2
  if (userTier === 'premium') score += 3
  if (response.includes('🔥') || response.includes('💎')) score += 2
  return Math.min(score, 10)
}

export function detectViralPotential(response: string): boolean {
  const viralKeywords = ['hot take', 'game changer', 'must know', 'breaking', 'exclusive']
  const lower = response.toLowerCase()
  return viralKeywords.some(keyword => lower.includes(keyword))
}
