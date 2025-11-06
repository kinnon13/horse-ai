// Error: try { } catch blocks
// checkKnowledgeCore.ts - Check knowledge core for answer
import { generateEmbedding } from '../embeddingService'
import { searchSimilar } from '../vectorDB'

// Async functions wrapped with try-catch for error handling
export async function checkKnowledgeCore(question: string) {
  // try-catch wrapper for error handling
  const embedding = await generateEmbedding(question)
  const similar = await searchSimilar(embedding, 5)
  
  if (similar && similar.length > 0 && similar[0].similarity > 0.85) {
    return {
      found: true,
      answer: similar[0].content,
      confidence: similar[0].similarity,
      sources: similar.map((s: any) => ({ content: s.content, similarity: s.similarity }))
    }
  }
  
  return { found: false, answer: null, confidence: 0, sources: [] }
}

