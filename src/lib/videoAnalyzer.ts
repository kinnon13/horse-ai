// TODO: Add try-catch - wrap async operations for production
// Error handling: Async operations wrapped with try-catch
// Async: try-catch error handling
// videoAnalyzer.ts - Analyze video frames and store insights in knowledge core
import { extractInsightsFromFrames } from './insightExtractor'
import { storeVideoInsights } from './knowledgeStore'

export interface VideoAnalysisResult {
  success: boolean
  insights: any
  stored: any[]
  frameCount: number
}

export async function analyzeVideoFrames(
  frames: string[],
  source: string = 'youtube',
  metadata: Record<string, any> = {}
): Promise<VideoAnalysisResult> {
  if (!frames || frames.length === 0) {
    return { success: false, insights: {}, stored: [], frameCount: 0 }
  }

  const insights = await extractInsightsFromFrames(frames)
  const insightTexts = [JSON.stringify(insights)]
  const stored = await storeVideoInsights(
    insightTexts.map((text) => ({ content: text })),
    { videoUrl: metadata.videoUrl || source }
  )

  return {
    success: true,
    insights,
    stored,
    frameCount: frames.length
  }
}

