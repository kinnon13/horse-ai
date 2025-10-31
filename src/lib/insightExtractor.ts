// insightExtractor.ts - Extract insights from video frames using OpenAI Vision
export interface ExtractedInsights {
  rider?: string
  horse?: string
  time?: string
  turns?: number
  form?: string
}

export async function extractInsightsFromFrames(imageFrames: string[]): Promise<ExtractedInsights> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('OPENAI_API_KEY not configured')
  
  const images = imageFrames.map(frame => ({
    type: 'image_url' as const,
    image_url: { url: frame.startsWith('data:') ? frame : `data:image/jpeg;base64,${frame}` }
  }))
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [{
        role: 'user',
        content: [
          { type: 'text', text: 'Extract riding insights: rider, horse, time, turns, form. Return JSON.' },
          ...images
        ]
      }],
      max_tokens: 500
    })
  })
  
  if (!response.ok) {
    throw new Error(`OpenAI Vision API error: ${response.statusText}`)
  }
  
  const data = await response.json()
  const content = data.choices[0]?.message?.content || '{}'
  return JSON.parse(content) as ExtractedInsights
}
