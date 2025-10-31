// provider-router/route.ts - Route by SLA/cost/flags
import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/RateLimitService'

export async function POST(req: NextRequest) {
  try {
    const { userId, provider, sla, cost, flags } = await req.json()
    if (!userId) return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    const rateLimit = await checkRateLimit(userId)
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded', remaining: 0 }, { status: 429 })
    }
    const routeResult = selectProvider(provider, sla, cost, flags)
    return NextResponse.json({
      success: true,
      provider: routeResult.provider,
      reason: routeResult.reason,
      estimatedCost: routeResult.cost,
      estimatedLatency: routeResult.latency,
      remaining: rateLimit.remaining
    })
  } catch (error) {
    console.error('Provider router error:', error)
    return NextResponse.json(
      { error: 'Routing failed', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    )
  }
}

function selectProvider(preferred: string | undefined, sla: number | undefined, cost: number | undefined, flags: string[] | undefined): { provider: string; reason: string; cost: number; latency: number } {
  if (preferred && !flags?.includes('blocked')) return { provider: preferred, reason: 'user_preference', cost: cost || 0.001, latency: sla || 500 }
  if (flags?.includes('low_latency')) return { provider: 'fast_provider', reason: 'sla_priority', cost: 0.002, latency: 200 }
  if (flags?.includes('cost_optimized')) return { provider: 'cheap_provider', reason: 'cost_priority', cost: 0.0005, latency: 1000 }
  return { provider: 'default_provider', reason: 'balanced', cost: 0.001, latency: 500 }
}