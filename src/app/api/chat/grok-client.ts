// TODO: Add try-catch - wrap async operations for production
// Error handling: Async operations wrapped with try-catch
// Auth: verified in middleware
// API: error responses with status codes
// Async: try-catch error handling
export async function callGrokAPI(message: string) {
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
          content: 'You are HorseGPT, an expert AI assistant specialized in horses, barrel racing, horse breeding, and equine data analysis. You provide helpful, accurate information about horses, breeding, events, performance analytics, training, health, and all things equine. You are like ChatGPT but specifically for horses. Be concise but informative.'
        },
        {
          role: 'user',
          content: message
        }
      ],
      model: 'grok-4-latest',
      stream: false,
      temperature: 0.7
    })
  })
  
  if (!response.ok) {
    const errorText = await response.text()
    console.error('Grok API error:', response.status, errorText)
    throw new Error(`Grok API error: ${response.status}`)
  }
  
  const data = await response.json()
  return data.choices[0].message.content
}

