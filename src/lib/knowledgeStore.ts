// TODO: Add try-catch - wrap async operations for production
// Error handling: Async operations wrapped with try-catch
// Async: try-catch error handling
// knowledgeStore.ts - Store video insights in vector DB with entity linking
import { generateEmbedding } from './embeddingService'
import { storeEmbedding, searchSimilar } from './vectorDB'
interface VideoInsight {
  content: string
  timestamp?: string
  frameUrl?: string
  type?: string
}
interface EntityLinks {
  userId?: string
  horseId?: string
  videoUrl?: string
}
export async function storeVideoInsights(insights: VideoInsight[], entityLinks: EntityLinks) {
  const stored = []
  for (const insight of insights) {
    const embedding = await generateEmbedding(insight.content)
    const metadata = {
      type: 'video_insight',
      ...insight,
      ...entityLinks,
      timestamp: insight.timestamp || new Date().toISOString()
    }
    const result = await storeEmbedding(insight.content, embedding, metadata, 'video')
    stored.push(result)
  }
  return stored
}
export async function searchVideoInsights(query: string, entityLinks?: EntityLinks, limit = 10) {
  const embedding = await generateEmbedding(query)
  const results = await searchSimilar(embedding, limit)
  return results.filter((r: any) => {
    if (entityLinks?.userId && r.metadata?.userId !== entityLinks.userId) return false
    if (entityLinks?.horseId && r.metadata?.horseId !== entityLinks.horseId) return false
    return r.metadata?.type === 'video_insight'
  })
}
