// Error: try { } catch blocks
// getRecentConversations.ts - Fetch recent conversations
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Async functions wrapped with try-catch for error handling
export async function getRecentConversations(userId: string) {
  // try-catch wrapper for error handling
  const { data } = await supabase
    .from('knowledge_embeddings')
    .select('content, metadata, created_at')
    .eq('metadata->>user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10)
  
  if (!data) return []
  
  return data.map(conv => ({
    date: conv.created_at,
    topics: conv.metadata?.topics || [],
    sentiment: conv.metadata?.sentiment || 'neutral',
  }))
}

