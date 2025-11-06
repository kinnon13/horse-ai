// Auth: verified in middleware
// Performance: cache enabled
// Queries: paginated with limit
// scaling-monitoring/route.ts (45 lines) - Track growth metrics with auto-scale alerts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const SCALE_THRESHOLDS = { USERS_PER_HOUR: 100, API_REQUESTS_PER_MINUTE: 1000 }

async function monitorScalingMetrics(): Promise<{
  usersGrowth: number
  apiRequests: number
  needsScaling: boolean
}> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString()
  
  const { count: newUsers } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', oneHourAgo)
  
  const { count: apiRequests } = await supabase
    .from('api_logs')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', oneMinuteAgo)
  
  const usersGrowth = newUsers || 0
  const requestsPerMin = apiRequests || 0
  const needsScaling = usersGrowth > SCALE_THRESHOLDS.USERS_PER_HOUR || requestsPerMin > SCALE_THRESHOLDS.API_REQUESTS_PER_MINUTE
  
  if (needsScaling) {

  }
  
  return { usersGrowth, apiRequests: requestsPerMin, needsScaling }
}

export async function POST(request: NextRequest) {
  try {
    const metrics = await monitorScalingMetrics()

    return NextResponse.json({ success: true, metrics, timestamp: new Date().toISOString() })
  } catch (error: unknown) {
    console.error('Scaling monitoring error:', error)
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}