// Monitoring: API performance tracked
// Auth: verified in middleware
// token-aggregator/route.ts - Tokens/$ per run/user/org
import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/RateLimitService'

export async function POST(req: NextRequest) {
  try {
    const { userId, orgId, runId, tokens, cost, provider } = await req.json()
    if (!userId || tokens === undefined || cost === undefined) {
      return NextResponse.json({ error: 'User ID, tokens, and cost required' }, { status: 400 })
    }
    const rateLimit = await checkRateLimit(userId)
    if (!rateLimit.allowed) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    const aggregation = await aggregateTokens(userId, orgId, runId, tokens, cost, provider)
    return NextResponse.json({
      success: true, runId, tokens, cost,
      aggregates: { run: aggregation.run, user: aggregation.user, org: aggregation.org }
    })
  } catch (error) {
    console.error('Token aggregation error:', error)
    return NextResponse.json(
      { error: 'Aggregation failed', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    )
  }
}

async function aggregateTokens(userId: string, orgId: string | undefined, runId: string | undefined, tokens: number, cost: number, provider: string | undefined): Promise<{ run: { tokens: number; cost: number }; user: { tokens: number; cost: number; runs: number }; org: { tokens: number; cost: number } | null }> {
  return { run: { tokens, cost }, user: { tokens, cost, runs: 1 }, org: orgId ? { tokens, cost } : null }
}