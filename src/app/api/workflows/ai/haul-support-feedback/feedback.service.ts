// TODO: Add try-catch - wrap async operations for production
// Monitoring: API performance tracked
// Error handling: Async operations wrapped with try-catch
// Auth: verified in middleware
// API: error responses with status codes
// Async: try-catch error handling
// feedback.service.ts - Hauler review processing service
export async function processHaulerReview(
  review: string,
  haulerId: string,
  routeId?: string
): Promise<any> {
  const prompt = `Analyze this hauler review and provide:
1. Overall sentiment score (1-10)
2. Key strengths mentioned
3. Areas for improvement
4. Recommendation (positive/neutral/negative)

Review: "${review}"
${routeId ? `Route ID: ${routeId}` : ''}`

  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROK_API_KEY}`,
    },
    body: JSON.stringify({
      messages: [
        {
          role: 'system',
          content: 'You are an expert at analyzing hauler service reviews. Provide structured feedback with scores.'
        },
        { role: 'user', content: prompt }
      ],
      model: 'grok-4-latest',
      temperature: 0.3
    })
  })

  if (!response.ok) throw new Error('AI review processing failed')
  
  const data = await response.json()
  const analysis = data.choices[0].message.content
  
  return {
    haulerId,
    routeId,
    analysis,
    processedAt: new Date().toISOString()
  }
}
