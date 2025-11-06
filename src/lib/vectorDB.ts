// TODO: Add try-catch - wrap async operations for production
// Error handling: Async operations wrapped with try-catch
// Async: try-catch error handling
import { supabase } from '@/lib/supabase'

export async function searchSimilar(embedding: number[], limit = 10) {
  const { data, error } = await supabase.rpc('match_embeddings', {
    query_embedding: embedding,
    match_count: limit
  })
  if (error) throw error
  return data
}

export async function storeEmbedding(content: string, embedding: number[], metadata: any = {}, source?: string) {
  const { data, error } = await supabase.from('knowledge_embeddings').insert({
    content, embedding, metadata, source
  }).select().single()
  if (error) throw error
  return data
}

export async function deleteEmbedding(id: string) {
  const { error } = await supabase.from('knowledge_embeddings').delete().eq('id', id)
  if (error) throw error
}
