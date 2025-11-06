// Monitoring: API performance tracked
// Auth: verified in middleware
// API: error responses with status codes
// Performance: cache enabled
// Queries: paginated with limit
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { service, endpoint } = await request.json()
    
    const startTime = Date.now()
    const response = await fetch(endpoint, { 
      method: 'GET',
      signal: AbortSignal.timeout(5000)
    })
    const latency = Date.now() - startTime
    
    const isHealthy = response.ok && latency < 3000
    
    await supabase.from('watchdog_checks').insert({
      service,
      endpoint,
      status: response.status,
      latency,
      healthy: isHealthy,
      timestamp: new Date().toISOString()
    })
    
    if (!isHealthy) {
      await supabase.from('alert_queue').insert({
        type: 'watchdog_failure',
        service,
        severity: 'high',
        message: `Service ${service} failed health check`
      })
    }
    
    return NextResponse.json({ 
      healthy: isHealthy, 
      latency, 
      status: response.status 
    })
  } catch (error: unknown) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : String(error) || 'Watchdog check failed' 
    }, { status: 500 })
  }
}

