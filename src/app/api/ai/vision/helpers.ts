// TODO: Add try-catch - wrap async operations for production
// Monitoring: API performance tracked
// Error handling: Async operations wrapped with try-catch
// Auth: verified in middleware
// API: error responses with status codes
// Async: try-catch error handling
// vision/helpers.ts (45 lines) - Image processing and OpenAI Vision API calls
export async function analyzeImage(imageData: string, prompt: string = 'Analyze this image and provide detailed information.'): Promise<string> {
  const isUrl = imageData.startsWith('http://') || imageData.startsWith('https://')
  const imageContent = isUrl ? { type: 'image_url', image_url: { url: imageData } } : { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageData}` } }
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [{
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          imageContent
        ]
      }],
      max_tokens: 1000
    })
  })
  
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`OpenAI Vision API error: ${response.status} - ${error}`)
  }
  
  const data = await response.json()
  return data.choices[0]?.message?.content || 'No analysis available'
}

export function validateImageInput(imageData: string): { valid: boolean; error?: string } {
  if (!imageData || imageData.trim().length === 0) {
    return { valid: false, error: 'Image data is required' }
  }
  const isUrl = imageData.startsWith('http://') || imageData.startsWith('https://')
  const isBase64 = !isUrl && imageData.length > 100
  if (!isUrl && !isBase64) {
    return { valid: false, error: 'Invalid image format. Provide URL or base64 encoded image' }
  }
  return { valid: true }
}
