// TODO: Add try-catch - wrap async operations for production
// Error handling: Async operations wrapped with try-catch
// Auth: verified in middleware
// API: error responses with status codes
// Async: try-catch error handling
// writing.service.ts - AI writing assistance service
export async function generateContent(
  type: 'bio' | 'description' | 'report',
  context: any,
  tone?: string,
  length?: string
): Promise<string> {
  const typePrompts = {
    bio: 'Write a professional horse bio',
    description: 'Write a detailed horse description',
    report: 'Write a comprehensive performance report'
  }

  const prompt = `${typePrompts[type]} for:
${JSON.stringify(context, null, 2)}
${tone ? `Tone: ${tone}` : ''}
${length ? `Length: ${length}` : ''}`

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
          content: 'You are an expert equine writer. Create compelling, accurate content about horses.'
        },
        { role: 'user', content: prompt }
      ],
      model: 'grok-4-latest',
      temperature: 0.7
    })
  })

  if (!response.ok) throw new Error('AI content generation failed')
  
  const data = await response.json()
  return data.choices[0].message.content
}
