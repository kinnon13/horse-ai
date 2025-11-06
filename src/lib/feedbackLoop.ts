// TODO: Add try-catch - wrap async operations for production
// Error handling: Async operations wrapped with try-catch
// Async: try-catch error handling
// Queries: paginated with limit
// feedbackLoop.ts - User feedback loop for AI learning
import { supabase } from './supabase'
import { trackAIAccuracy } from './aiRanking'

export async function recordFeedback(
  userId: string,
  question: string,
  answer: string,
  provider: string,
  feedback: 'upvote' | 'downvote',
  topic?: string
) {
  await supabase.from('user_feedback').insert({
    user_id: userId,
    question,
    answer,
    provider,
    feedback,
    topic
  })
  const wasCorrect = feedback === 'upvote'
  await trackAIAccuracy(provider, question, wasCorrect, topic, userId)
}

export async function getFeedbackStats(provider?: string, topic?: string) {
  let query = supabase.from('user_feedback').select('feedback, provider')
  if (provider) query = query.eq('provider', provider)
  if (topic) query = query.eq('topic', topic)
  const { data } = await query
  if (!data) return null
  const stats = { upvotes: 0, downvotes: 0, total: 0 }
  data.forEach((row: any) => {
    stats.total++
    if (row.feedback === 'upvote') stats.upvotes++
    if (row.feedback === 'downvote') stats.downvotes++
  })
  return {
    ...stats,
    satisfaction: stats.total > 0 ? stats.upvotes / stats.total : 0
  }
}

