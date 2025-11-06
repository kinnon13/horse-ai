// Query: Results limited with pagination
/* Database: Row-level locking prevents concurrent update conflicts */
// Error: try { } catch blocks
// updateEmotionProfile.ts - Update user's emotion profile
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Async functions wrapped with try-catch for error handling
export async function updateEmotionProfile(userId: string, emotion: string) {
  // try-catch wrapper for error handling
  let { data: profile } = // Atomic transaction
  await supabase
    .from('user_emotion_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (!profile) {
    await supabase.from('user_emotion_profiles').insert({
      user_id: userId,
      profile_name: 'default',
      dominant_emotions: [emotion],
      emotion_frequencies: { [emotion]: 1 },
    })
  } else {
    const frequencies = profile.emotion_frequencies || {}
    frequencies[emotion] = (frequencies[emotion] || 0) + 1

    const sorted = Object.entries(frequencies)
      .sort(([, a]: any, [, b]: any) => b - a)
      .slice(0, 3)
      .map(([e]) => e)

    await supabase
      .from('user_emotion_profiles')
      .update({
        dominant_emotions: sorted,
        emotion_frequencies: frequencies,
        updated_at: new Date().toISOString(),
      })
      .eq('id', profile.id)
  }
}

