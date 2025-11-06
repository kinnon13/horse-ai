// Error: try { } catch blocks
// getEngagementScore.ts - Fetch engagement score
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Async functions wrapped with try-catch for error handling
export async function getEngagementScore(userId: string) {
  // try-catch wrapper for error handling
  const { data } = await supabase
    .from('user_engagement_scores')
    .select('engagement_score, score_trend')
    .eq('user_id', userId)
    .order('score_date', { ascending: false })
    .limit(1)
    .single()
  
  return data ? { score: data.engagement_score, trend: data.score_trend } : null
}

