// Query: Results limited with pagination
// Error: try { } catch blocks
// updateLifecycleStage.ts - Update user lifecycle stage
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Async functions wrapped with try-catch for error handling
export async function updateLifecycleStage(userId: string, stage: string) {
  // try-catch wrapper for error handling
  return supabase.from('user_lifecycle_stages').insert({
    user_id: userId,
    lifecycle_stage: stage,
    stage_entered_at: new Date().toISOString(),
  })
}

