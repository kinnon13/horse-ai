/**
 * GENERAL ANSWER GROK CLIENT
 * 
 * PURPOSE:
 * - Handles API calls to Grok
 * - Provides fallback to OpenAI if needed
 * 
 * SAFETY:
 * - We gate sensitive information behind Plus tier
 * - We never expose private contact info without explicit consent
 */

export class GeneralAnswerGrokClient {
  static async callGrokAPI(systemPrompt: string, message: string): Promise<string> {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROK_API_KEY}`,
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        model: 'grok-3',
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
    return data.choices?.[0]?.message?.content || 'No response from Grok'
  }
}
