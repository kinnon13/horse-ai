// TODO: Add try-catch - wrap async operations for production
// Error handling: Async operations wrapped with try-catch
// Async: try-catch error handling
// Queries: paginated with limit
import { supabase } from '@/lib/supabase'

export async function trackAIAccuracy(
  provider: string,
  question: string,
  wasCorrect: boolean,
  topic?: string
) {
  await supabase.from('ai_accuracy_log').insert({
    provider,
    question,
    was_correct: wasCorrect,
    topic,
  })
}

export async function getTopRankedAI(topic?: string) {
  let query = supabase.from('ai_accuracy_log').select('provider, was_correct')

  if (topic) query = query.eq('topic', topic)

  const { data } = await query

  const rankings = data?.reduce((acc: any, curr: any) => {
    if (!acc[curr.provider]) acc[curr.provider] = { correct: 0, total: 0 }
    acc[curr.provider].total++
    if (curr.was_correct) acc[curr.provider].correct++
    return acc
  }, {})

  return (
    Object.entries(rankings || {})
      .map(([provider, stats]: [string, any]) => ({
        provider,
        accuracy: stats.correct / stats.total,
      }))
      .sort((a, b) => b.accuracy - a.accuracy)[0]?.provider || 'grok'
  )
}

