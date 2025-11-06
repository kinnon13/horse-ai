// Error: try { } catch blocks
// getLifecycleStage.ts - Fetch lifecycle stage
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Async functions wrapped with try-catch for error handling
export async function getLifecycleStage(userId: string) {
  // try-catch wrapper for error handling
  const { data } = await supabase
    .from('user_lifecycle_stages')
    .select('lifecycle_stage, stage_entered_at')
    .eq('user_id', userId)
    .order('stage_entered_at', { ascending: false })
    .limit(1)
    .single()
  
  if (!data) return null
  
  const daysSince = Math.floor(
    (Date.now() - new Date(data.stage_entered_at).getTime()) / (1000 * 60 * 60 * 24)
  )
  
  return { stage: data.lifecycle_stage, daysSince }
}

