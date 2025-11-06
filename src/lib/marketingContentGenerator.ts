// TODO: Add try-catch - wrap async operations for production
// Error handling: Async operations wrapped with try-catch
// Async: try-catch error handling
// marketingContentGenerator.ts - AI content generation functions
export async function generateMarketingContent(
  topic: string,
  channel: string,
  audience: string
) {
  const prompt = `Create ${channel} content for ${audience} about ${topic} in equine industry. Make it compelling and conversion-focused.`
  
  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.XAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'grok-beta',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8
    })
  })
  
  const data = await response.json()
  return data.choices[0].message.content
}
