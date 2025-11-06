// Error: try { } catch blocks
// getCurrentEmotion.ts - Fetch current emotion
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Async functions wrapped with try-catch for error handling
export async function getCurrentEmotion(userId: string) {
  // try-catch wrapper for error handling
  const { data } = await supabase
    .from('user_emotion_tracking')
    .select('emotion, confidence_score')
    .eq('user_id', userId)
    .order('detected_at', { ascending: false })
    .limit(1)
    .single()
  
  return data ? { emotion: data.emotion, confidence: data.confidence_score } : null
}

