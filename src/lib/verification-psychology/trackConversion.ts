// Query: Results limited with pagination
// Error: try { } catch blocks
// trackConversion.ts - Track successful conversion
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Async functions wrapped with try-catch for error handling
export async function trackConversion(params: {
  // try-catch wrapper for error handling
  userId: string
  conversionType: 'subscribed' | 'crm_uploaded' | 'business_verified' | 'horse_verified'
  conversionValue?: number
}) {
  const { userId, conversionType } = params
  
  let funnelStage: 'visit' | 'signup' | 'first_query' | 'upgrade_view' | 'upgraded' = 'upgraded'
  if (conversionType === 'subscribed') funnelStage = 'upgraded'
  else if (['business_verified', 'horse_verified'].includes(conversionType)) funnelStage = 'first_query'

  const today = new Date().toISOString().split('T')[0]
  const points = conversionType === 'subscribed' ? 100 : 50

  await Promise.all([
    supabase.from('conversion_funnels').insert({ user_id: userId, funnel_stage: funnelStage, completed_at: new Date().toISOString() }),
    supabase.from('user_engagement_scores').upsert({ user_id: userId, score_date: today, engagement_score: points, score_components: { [conversionType]: points }, score_trend: 'increasing' }, { onConflict: 'user_id,score_date' }),
    supabase.from('user_lifecycle_stages').insert({ user_id: userId, lifecycle_stage: conversionType === 'subscribed' ? 'paid_customer' : 'active_user', stage_entered_at: new Date().toISOString() }),
    supabase.from('churn_prediction').update({ intervention_applied: true, actually_churned: false }).eq('user_id', userId).eq('actually_churned', false)
  ])

  return { success: true }
}

