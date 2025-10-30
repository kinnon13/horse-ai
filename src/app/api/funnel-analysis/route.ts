import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { logEvent, CRITICAL_EVENTS } from '@/lib/logEvent'

export async function GET(request: NextRequest) {
  try {
    // Analyze funnel drops in the last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    
    // Get conversion rates for each stage
    const { data: onboardingStarted } = await supabaseAdmin
      .from('log_events')
      .select('user_id')
      .eq('event_type', 'ONBOARDING_STARTED')
      .gte('created_at', oneHourAgo)
    
    const { data: onboardingCompleted } = await supabaseAdmin
      .from('log_events')
      .select('user_id')
      .eq('event_type', 'ONBOARDING_COMPLETED')
      .gte('created_at', oneHourAgo)
    
    const { data: serviceRequests } = await supabaseAdmin
      .from('log_events')
      .select('user_id')
      .eq('event_type', 'SERVICE_REQUEST_CREATED')
      .gte('created_at', oneHourAgo)
    
    const { data: serviceCompleted } = await supabaseAdmin
      .from('log_events')
      .select('user_id')
      .eq('event_type', 'SERVICE_REQUEST_COMPLETED')
      .gte('created_at', oneHourAgo)
    
    // Calculate conversion rates
    const onboardingRate = onboardingCompleted?.length / (onboardingStarted?.length || 1)
    const serviceRate = serviceCompleted?.length / (serviceRequests?.length || 1)
    
    // Find worst drop stage
    let worstDropStage = null
    let recommendedPatch = null
    let patchDetails = null
    
    if (onboardingRate < 0.7) {
      worstDropStage = 'onboarding_completion'
      recommendedPatch = 'extend_trial_period'
      patchDetails = 'Offer 14-day Pro trial instead of 7-day'
    } else if (serviceRate < 0.5) {
      worstDropStage = 'service_completion'
      recommendedPatch = 'add_reminder_sms'
      patchDetails = 'Send reminder SMS after 15 minutes'
    }
    
    return NextResponse.json({
      worstDropStage,
      recommendedPatch,
      patchDetails,
      metrics: {
        onboardingRate,
        serviceRate,
        onboardingStarted: onboardingStarted?.length || 0,
        onboardingCompleted: onboardingCompleted?.length || 0,
        serviceRequests: serviceRequests?.length || 0,
        serviceCompleted: serviceCompleted?.length || 0
      }
    })
  } catch (error) {
    console.error('Error analyzing funnel:', error)
    return NextResponse.json(
      { error: 'Failed to analyze funnel' },
      { status: 500 }
    )
  }
}

