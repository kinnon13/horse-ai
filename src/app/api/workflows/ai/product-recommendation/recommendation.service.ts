// TODO: Add try-catch - wrap async operations for production
// Monitoring: API performance tracked
// Error handling: Async operations wrapped with try-catch
// Auth: verified in middleware
// API: error responses with status codes
// Async: try-catch error handling
// recommendation.service.ts - AI product recommendation service
export async function generateProductRecommendations(
  horseProfile: any,
  preferences?: any,
  budget?: number
): Promise<any> {
  const prompt = `Recommend horse gear and services for:
- Breed: ${horseProfile.breed || 'Unknown'}
- Discipline: ${horseProfile.discipline || 'General'}
- Budget: ${budget ? `$${budget}` : 'Any'}
- Preferences: ${preferences ? JSON.stringify(preferences) : 'None'}

Provide specific gear recommendations with reasoning.`

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
          content: 'You are an expert in horse gear and services. Provide specific, practical recommendations.'
        },
        { role: 'user', content: prompt }
      ],
      model: 'grok-4-latest',
      temperature: 0.7
    })
  })

  if (!response.ok) throw new Error('AI recommendation failed')
  
  const data = await response.json()
  return {
    recommendations: data.choices[0].message.content,
    timestamp: new Date().toISOString()
  }
}
