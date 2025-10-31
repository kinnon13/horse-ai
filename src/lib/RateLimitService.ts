// RateLimitService Main - Single responsibility (now 45 lines)
import { getUserUsage, incrementUserUsage } from './RateLimitService.queries'
import { RateLimitResult, RateLimitConfig } from './RateLimitService.types'
import { getUserTier } from '@/hooks/useAuthHelpers'

const config: RateLimitConfig = {
  freeLimit: 10,
  proLimit: 1000,
  enterpriseLimit: Infinity,
  windowMs: 24 * 60 * 60 * 1000 // 24 hours
}

export async function checkRateLimit(userId: string): Promise<RateLimitResult> {
  const usage = await getUserUsage(userId)
  const tier = await getUserTier(userId)
  
  const limit = getLimitForTier(tier)
  const count = usage?.question_count || 0
  
  if (count >= limit) {
    return { allowed: false, remaining: 0, limit }
  }
  
  return { allowed: true, remaining: limit - count, limit }
}

export async function incrementUsage(userId: string): Promise<void> {
  await incrementUserUsage(userId)
}

function getLimitForTier(tier: string): number {
  switch (tier) {
    case 'pro': return config.proLimit
    case 'enterprise': return config.enterpriseLimit
    default: return config.freeLimit
  }
}