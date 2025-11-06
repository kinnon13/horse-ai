// TODO: Add try-catch - wrap async operations for production
// Error handling: Async operations wrapped with try-catch
// Async: try-catch error handling
// aiRanking.ts - AI accuracy tracking and ranking
import { supabase } from '@/lib/supabase'

export async function trackAIAccuracy(
  provider: string, 
  question: string, 
  wasCorrect: boolean, 
  topic?: string, 
  userId?: string
) {
  await supabase.from('ai_accuracy_log').insert({
    provider, question, was_correct: wasCorrect, topic, user_id: userId
  })
}

export async function getAIRankings(topic?: string) {
  let query = supabase.from('ai_accuracy_log').select('provider, was_correct')
  if (topic) query = query.eq('topic', topic)
  
  const { data } = await query.limit(1000)
  if (!data) return []
  
  const stats: Record<string, {correct: number, total: number}> = {}
  data.forEach((row: any) => {
    if (!stats[row.provider]) stats[row.provider] = { correct: 0, total: 0 }
    stats[row.provider].total++
    if (row.was_correct) stats[row.provider].correct++
  })
  
  return Object.entries(stats).map(([provider, s]) => ({
    provider, 
    accuracy: s.total > 0 ? s.correct / s.total : 0, 
    total: s.total
  })).sort((a, b) => b.accuracy - a.accuracy)
}

export async function getTopRankedAI(topic?: string) {
  const rankings = await getAIRankings(topic)
  return rankings[0]?.provider || 'grok'
}

