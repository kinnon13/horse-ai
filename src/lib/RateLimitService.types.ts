// RateLimitService Types - Single responsibility
export interface RateLimitResult {
  allowed: boolean
  remaining: number
  limit: number
  resetTime?: string
}

export interface UserUsage {
  user_id: string
  question_count: number
  last_question_at: string
  tier: 'free' | 'pro' | 'enterprise'
}

export interface RateLimitConfig {
  freeLimit: number
  proLimit: number
  enterpriseLimit: number
  windowMs: number
}
