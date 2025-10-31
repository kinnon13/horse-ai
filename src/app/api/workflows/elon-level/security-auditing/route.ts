// security-auditing/route.ts (45 lines) - Daily security scans with auto-block
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

async function scanSecurityThreats(): Promise<{ threats: number; blocked: number }> {
  let blocked = 0
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  
  const { data: suspiciousLogins } = await supabase
    .from('auth_logs')
    .select('*')
    .gte('created_at', oneDayAgo)
    .eq('status', 'failed')
    .gte('attempts', 5)
  
  if (suspiciousLogins) {
    for (const login of suspiciousLogins) {
      await supabase.from('blocked_ips').upsert({
        ip_address: login.ip_address,
        reason: 'Multiple failed login attempts',
        blocked_at: new Date().toISOString()
      })
      blocked++
    }
  }
  
  const { data: rateLimitViolations } = await supabase
    .from('api_logs')
    .select('*')
    .gte('created_at', oneHourAgo)
    .gte('requests_per_minute', 100)
  
  const threats = (suspiciousLogins?.length || 0) + (rateLimitViolations?.length || 0)
  return { threats, blocked }
}

export async function POST(request: NextRequest) {
  try {
    const { threats, blocked } = await scanSecurityThreats()
    console.log(`🔒 Security scan: ${threats} threats found, ${blocked} IPs blocked`)
    if (threats > 0) console.error('🚨 SECURITY THREAT DETECTED')
    return NextResponse.json({ success: true, threats, blocked, timestamp: new Date().toISOString() })
  } catch (error: any) {
    console.error('Security audit error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}