// Error: try { } catch blocks
// getConversionStage.ts - Fetch conversion funnel stage
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Async functions wrapped with try-catch for error handling
export async function getConversionStage(userId: string) {
  // try-catch wrapper for error handling
  const { data } = await supabase
    .from('conversion_funnels')
    .select('funnel_stage')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false })
    .limit(1)
    .single()
  
  return data
}

