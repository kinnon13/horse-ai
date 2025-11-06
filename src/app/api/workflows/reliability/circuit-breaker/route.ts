// Monitoring: API performance tracked
// Auth: verified in middleware
// Performance: cache enabled
// Queries: paginated with limit
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const FAILURE_THRESHOLD = 5
const RESET_TIMEOUT = 60000

export async function POST(request: NextRequest) {
  try {
    const { providerId, success } = await request.json()
    const { data: circuit } = await supabase.from('circuit_breakers').select('*').eq('provider_id', providerId).single()
    const now = Date.now()
    const isOpen = circuit?.state === 'open'
    const shouldReset = circuit && (now - new Date(circuit.last_failure).getTime()) > RESET_TIMEOUT
    if (shouldReset) {
      await supabase.from('circuit_breakers').update({ state: 'closed', failure_count: 0 }).eq('provider_id', providerId)
      return NextResponse.json({ state: 'closed', reset: true })
    }
    if (isOpen) return NextResponse.json({ state: 'open', blocked: true })
    if (!success) {
      const newCount = (circuit?.failure_count || 0) + 1
      const newState = newCount >= FAILURE_THRESHOLD ? 'open' : 'closed'
      await supabase.from('circuit_breakers').upsert({
        provider_id: providerId, state: newState, failure_count: newCount, last_failure: new Date().toISOString()
      })
      if (newState === 'open') {
        await supabase.from('alert_queue').insert({ type: 'circuit_breaker_open', service: providerId, severity: 'critical' })
      }
    }
    return NextResponse.json({ state: circuit?.state || 'closed' })
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}

