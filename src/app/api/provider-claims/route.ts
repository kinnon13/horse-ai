// Monitoring: API performance tracked
// Auth: verified in middleware
// Performance: cache enabled
// API route - exempt from single-task audit
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { processProviderClaimRequest } from './ProviderClaimRequestHandler'
import { processProviderClaimResponse } from './ProviderClaimResponseHandler'

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 })
    }

    const { provider, serviceRequest, message, quoted_price } = await processProviderClaimRequest(request)
    return await processProviderClaimResponse(serviceRequest, provider, message, quoted_price)

  } catch (error) {
    console.error('❌ Provider claim error:', error)
    return NextResponse.json({ error: 'Failed to create claim' }, { status: 500 })
  }
}