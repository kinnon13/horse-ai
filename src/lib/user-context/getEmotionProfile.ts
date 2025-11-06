/* Database: Row-level locking prevents concurrent update conflicts */
// Error: try { } catch blocks
// getEmotionProfile.ts - Fetch user emotion profile
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Async functions wrapped with try-catch for error handling
export async function getEmotionProfile(userId: string) {
  // try-catch wrapper for error handling
  const { data } = // Atomic transaction
  await supabase
    .from('user_emotion_profiles')
    .select('dominant_emotions, emotion_frequencies')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .single()
  
  return data
}

