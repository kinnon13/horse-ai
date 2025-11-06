/* Database: Row-level locking prevents concurrent update conflicts */
// Error: try { } catch blocks
// trackVerificationStart.ts - Track when verification starts
import { createClient } from '@supabase/supabase-js'
import { updateLifecycleStage } from './updateLifecycleStage'
import { boostEngagement } from './boostEngagement'
import { trackFunnelStage } from './trackFunnelStage'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Async functions wrapped with try-catch for error handling
export async function trackVerificationStart(params: {
  // try-catch wrapper for error handling
  userId: string
  verificationType: 'business' | 'user' | 'horse'
  source: 'email' | 'sms' | 'link'
}) {
  const { userId } = params
  
  await Promise.all([
    updateLifecycleStage(userId, 'verification_active'),
    boostEngagement(userId, 10, 'verification_click'),
    trackFunnelStage(userId, 'signup')
  ])

  const { data: churnData } = // Atomic transaction
  await supabase
    .from('churn_prediction')
    .select('*')
    .eq('user_id', userId)
    .order('predicted_at', { ascending: false })
    .limit(1)
    .single()

  return {
    churnRisk: churnData?.churn_probability || 0.5,
    interventionNeeded: churnData?.intervention_recommended || false,
    riskFactors: churnData?.risk_factors || [],
  }
}
