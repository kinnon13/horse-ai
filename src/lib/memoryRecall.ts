// memoryRecall.ts (49 lines) - Recall user memories from knowledge embeddings
import { supabase } from '@/lib/supabase'

export async function recallUserMemories(userId: string): Promise<string> {
  if (!userId) return 'Welcome back! How can I help you today?'
  
  // Search for user-specific interactions in knowledge embeddings
  const { data: userMemories, error } = await supabase
    .from('knowledge_embeddings')
    .select('content, metadata, created_at')
    .eq('metadata->>user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10)
  
  if (error || !userMemories || userMemories.length === 0) {
    return 'Welcome! Ready to help you with your horses.'
  }
  
  const horses = extractHorses(userMemories)
  const topics = extractTopics(userMemories)
  return buildPersonalizedGreeting(horses, topics)
}

function extractHorses(memories: any[]): string[] {
  const horseNames = new Set<string>()
  memories.forEach(m => {
    if (m.metadata?.horse_name) horseNames.add(m.metadata.horse_name)
    const matches = m.content?.toLowerCase().match(/(?:horse|mare|stud|gelding)\s+(\w+)/gi)
    if (matches) matches.forEach((match: string) => horseNames.add(match.split(' ')[1]))
  })
  return Array.from(horseNames).slice(0, 3)
}

function extractTopics(memories: any[]): string[] {
  const topics = new Set<string>()
  memories.forEach(m => {
    if (m.metadata?.topic) topics.add(m.metadata.topic)
    if (m.metadata?.service_type) topics.add(m.metadata.service_type)
  })
  return Array.from(topics).slice(0, 3)
}

function buildPersonalizedGreeting(horses: string[], topics: string[]): string {
  let greeting = 'Welcome back!'
  if (horses.length > 0) greeting += ` I remember you've been asking about ${horses.join(' and ')}.`
  if (topics.length > 0) greeting += ` We've discussed ${topics.join(', ')}.`
  greeting += ' What would you like to know today?'
  return greeting
}
