import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/RateLimitService'
import { supabaseAdmin } from '@/lib/supabase-client'

export async function POST(req: NextRequest) {
  try {
    const { userId, output, runId, provider } = await req.json()

    if (!userId || !output) {
      return NextResponse.json({ error: 'User ID and output required' }, { status: 400 })
    }

    const rateLimit = await checkRateLimit(userId)
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }

    const score = evaluateOutput(output)
    if (score.shouldBlock) {
      await blockBadProvider(userId, provider, score.reasons)
    }

    return NextResponse.json({
      success: true,
      score: score.score,
      shouldBlock: score.shouldBlock,
      reasons: score.reasons,
      recommendation: score.recommendation,
      runId,
    })
  } catch (error) {
    console.error('Evaluation error:', error)
    return NextResponse.json(
      { error: 'Evaluation failed', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    )
  }
}

function evaluateOutput(output: string) {
  const reasons: string[] = []
  let score = 100

  if (output.length < 10) {
    score -= 30
    reasons.push('output_too_short')
  }

  if (output.includes('ERROR') || output.includes('FAILED')) {
    score -= 40
    reasons.push('contains_errors')
  }

  if (output.match(/<script|javascript:|onerror=/i)) {
    score -= 50
    reasons.push('security_risk')
  }

  const shouldBlock = score < 50
  const recommendation = shouldBlock ? 'block_provider' : score < 70 ? 'warn_user' : 'allow'

  return { score, shouldBlock, reasons, recommendation }
}

async function blockBadProvider(
  userId: string,
  provider: string | undefined,
  reasons: string[]
): Promise<void> {
  if (!provider) return

  await supabaseAdmin.from('ai_provider_blocks').upsert({
    user_id: userId,
    provider,
    reasons,
    blocked_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  })
}
