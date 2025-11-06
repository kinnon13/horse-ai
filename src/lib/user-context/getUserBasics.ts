// Query: Results limited with pagination
// Error: try { } catch blocks
// getUserBasics.ts - Fetch user basic info
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Async functions wrapped with try-catch for error handling
export async function getUserBasics(userId: string) {
  // try-catch wrapper for error handling
  const { data } = await supabase
    .from('users')
    .select('full_name, user_type, is_subscribed, subscription_tier, owns_business, business_type, total_searches, last_active_at, created_at')
    .eq('id', userId)
    .single()
  
  return data
}

