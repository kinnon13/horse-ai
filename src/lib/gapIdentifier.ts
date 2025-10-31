// gapIdentifier.ts (48 lines) - Gap identification logic
import { supabase } from './supabase'

export async function analyzeUserQueries() {
  const { data } = await supabase.from('ai_accuracy_log').select('question, topic, confidence').lt('confidence', 0.6).limit(100)
  if (!data) return []
  const gaps: Record<string, number> = {}
  data.forEach((row: any) => { const key = row.topic || 'general'; gaps[key] = (gaps[key] || 0) + 1 })
  return Object.entries(gaps).map(([topic, count]) => ({
    gap_type: 'search_query', description: `Low confidence on ${topic} queries`,
    source: 'user_queries', priority: count, user_count: count
  }))
}

export async function analyzeUserFeedback() {
  const { data } = await supabase.from('user_feedback').select('question, topic').eq('feedback', 'downvote').limit(100)
  if (!data) return []
  const gaps: Record<string, number> = {}
  data.forEach((row: any) => { gaps[row.question] = (gaps[row.question] || 0) + 1 })
  return Object.entries(gaps).filter(([_, count]) => count >= 3).map(([question, count]) => ({
    gap_type: 'user_request', description: `Users need better answer for: ${question}`,
    source: 'downvotes', priority: count * 2, user_count: count
  }))
}

export async function storeGap(gap: any) {
  await supabase.from('feature_gaps').insert(gap)
}

