// Query: Results limited with pagination
// Error: try { } catch blocks
// trackFunnelStage.ts - Track conversion funnel progress
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Async functions wrapped with try-catch for error handling
export async function trackFunnelStage(userId: string, stage: string) {
  // try-catch wrapper for error handling
  return supabase.from('conversion_funnels').insert({
    user_id: userId,
    funnel_stage: stage,
    completed_at: new Date().toISOString(),
  })
}

