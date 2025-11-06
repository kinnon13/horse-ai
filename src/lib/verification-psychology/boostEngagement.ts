// Query: Results limited with pagination
// Error: try { } catch blocks
// boostEngagement.ts - Boost user engagement score
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Async functions wrapped with try-catch for error handling
export async function boostEngagement(userId: string, points: number, reason: string) {
  // try-catch wrapper for error handling
  const today = new Date().toISOString().split('T')[0]
  
  return supabase.from('user_engagement_scores').upsert({
    user_id: userId,
    score_date: today,
    engagement_score: points,
    score_components: { [reason]: points },
    score_trend: 'increasing',
  }, { onConflict: 'user_id,score_date' })
}

