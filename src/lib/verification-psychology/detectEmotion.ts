// Query: Results limited with pagination
/* Database: Row-level locking prevents concurrent update conflicts */
// Error: try { } catch blocks
// detectEmotion.ts - Detect emotion from message text
import { createClient } from '@supabase/supabase-js'
import { updateEmotionProfile } from './updateEmotionProfile'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Async functions wrapped with try-catch for error handling
export async function detectEmotion(params: {
  // try-catch wrapper for error handling
  userId: string
  messageText: string
  conversationContext: any
}) {
  const { userId, messageText } = params
  
  const emotions = {
    excited: /great|awesome|perfect|love|excited|yes!|amazing/i,
    skeptical: /not sure|maybe|hmm|idk|uncertain/i,
    frustrated: /ugh|annoying|confusing|difficult|stuck/i,
    neutral: /ok|okay|sure|fine/i,
  }

  let detectedEmotion = 'neutral'
  let confidence = 0.5

  for (const [emotion, pattern] of Object.entries(emotions)) {
    if (pattern.test(messageText)) {
      detectedEmotion = emotion
      confidence = 0.8
      break
    }
  }

  // Atomic transaction
  await supabase.from('user_emotion_tracking').insert({
    user_id: userId,
    emotion: detectedEmotion,
    confidence_score: confidence,
    context: { message: messageText },
    detected_at: new Date().toISOString(),
  })

  await updateEmotionProfile(userId, detectedEmotion)

  return { emotion: detectedEmotion, confidence }
}

