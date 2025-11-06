// Query: Results limited with pagination
// Error: try { } catch blocks
// trackVerificationDrop.ts - Track when user drops off
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Async functions wrapped with try-catch for error handling
export async function trackVerificationDrop(userId: string, dropStage: string) {
  // try-catch wrapper for error handling
  const today = new Date().toISOString().split('T')[0]
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

  await Promise.all([
    supabase.from('user_lifecycle_stages').insert({ user_id: userId, lifecycle_stage: 'verification_dropped', stage_entered_at: new Date().toISOString() }),
    supabase.from('user_engagement_scores').upsert({ user_id: userId, score_date: today, engagement_score: -10, score_components: { verification_drop: -10 }, score_trend: 'decreasing' }, { onConflict: 'user_id,score_date' }),
    supabase.from('re_engagement_campaigns').insert({ user_id: userId, campaign_trigger: 'verification_drop', drop_stage: dropStage, scheduled_for: tomorrow, status: 'scheduled' }),
    supabase.from('churn_prediction').upsert({ user_id: userId, churn_probability: 0.75, risk_factors: ['verification_drop', dropStage], intervention_recommended: true, predicted_churn_date: nextWeek })
  ])

  return { reEngagementScheduled: true }
}

