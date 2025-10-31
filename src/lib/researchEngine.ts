import { supabase } from './supabase'
import { generateEmbedding } from './embeddingService'
import { storeEmbedding } from './vectorDB'

export async function identifyGaps() {
  const { data } = await supabase
    .from('ai_accuracy_log')
    .select('question, topic, confidence')
    .or('confidence.lt.0.7,was_correct.eq.false')
    .order('created_at', { ascending: false })
    .limit(20)
  if (!data) return []
  const gaps: Record<string, number> = {}
  data.forEach((row: any) => {
    const topic = row.topic || 'general'
    gaps[topic] = (gaps[topic] || 0) + 1
  })
  return Object.entries(gaps)
    .map(([topic, count]) => ({ topic, gapCount: count }))
    .sort((a, b) => b.gapCount - a.gapCount)
}

export async function researchTopic(topic: string) {
  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.1-sonar-large-128k-online',
      messages: [{
        role: 'user',
        content: `Research ${topic} in equine industry. Provide comprehensive expert knowledge.`
      }]
    })
  })
  const data = await response.json()
  return data.choices[0].message.content
}

export async function storeResearch(topic: string, content: string) {
  const embedding = await generateEmbedding(content)
  await storeEmbedding(content, embedding, {
    topic, type: 'research', source: 'autonomous_research'
  })
}

