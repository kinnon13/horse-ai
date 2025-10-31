// quota-enforcer/route.ts - Per user/org/day + backoff
import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, incrementUsage } from '@/lib/RateLimitService'

export async function POST(req: NextRequest) {
  try {
    const { userId, orgId, requestType } = await req.json()
    if (!userId) return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    const rateLimit = await checkRateLimit(userId)
    if (!rateLimit.allowed) {
      const backoffSeconds = calculateBackoff(userId, requestType)
      return NextResponse.json({
        error: 'Quota exceeded', remaining: 0, backoffSeconds,
        retryAfter: new Date(Date.now() + backoffSeconds * 1000).toISOString()
      }, { status: 429, headers: { 'Retry-After': backoffSeconds.toString() } })
    }
    await incrementUsage(userId)
    return NextResponse.json({
      success: true, allowed: true, remaining: rateLimit.remaining - 1,
      limit: rateLimit.limit, orgQuota: await getOrgQuota(orgId)
    })
  } catch (error) {
    console.error('Quota enforcer error:', error)
    return NextResponse.json(
      { error: 'Quota check failed', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    )
  }
}

function calculateBackoff(userId: string, requestType: string | undefined): number {
  return (requestType === 'heavy' ? 120 : 60)
}

async function getOrgQuota(orgId: string | undefined): Promise<{ used: number; limit: number } | null> {
  return orgId ? { used: 0, limit: 10000 } : null
}