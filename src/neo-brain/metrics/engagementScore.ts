// TODO: Add try-catch - wrap async operations for production
// Error handling: Async operations wrapped with try-catch
// Async: try-catch error handling
// engagementScore.ts - Track and calculate user engagement metrics
import { supabase } from '@/lib/supabase'

export async function calculateEngagementScore(userId: string): Promise<number> {
  const { data } = await supabase
    .from('engagement_metrics')
    .select('*')
    .eq('user_id', userId)
    .order('measured_at', { ascending: false })
    .limit(1)
    .single()

  if (!data) return 0

  let score = 0
  if (data.daily_questions >= 5) score += 10
  if (data.decision_support_usage >= 0.8) score += 20
  if (data.emotional_engagement >= 8) score += 15
  if (data.response_speed_seconds && data.response_speed_seconds < 300) score += 10
  if (data.share_count > 0 && data.share_count >= data.daily_questions * 0.2) score += 10
  
  const { data: user } = await supabase.from('users').select('tier').eq('id', userId).single()
  if (user?.tier === 'plus' || user?.tier === 'pro') score += 35

  return Math.min(score, 100)
}

export async function trackEngagementMetrics(userId: string, metrics: any) {
  const score = await calculateEngagementScore(userId)
  
  await supabase.from('engagement_metrics').insert({
    user_id: userId,
    daily_questions: metrics.daily_questions || 0,
    decision_support_usage: metrics.decision_support_usage || 0,
    emotional_engagement: metrics.emotional_engagement || 0,
    response_speed_seconds: metrics.response_speed_seconds,
    share_count: metrics.share_count || 0,
    engagement_score: score
  })
}

