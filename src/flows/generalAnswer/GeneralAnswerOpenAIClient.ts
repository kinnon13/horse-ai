/**
 * GENERAL ANSWER OPENAI CLIENT
 * 
 * PURPOSE:
 * - Handles API calls to OpenAI
 * - Provides fallback when Grok is unavailable
 * 
 * SAFETY:
 * - We gate sensitive information behind Plus tier
 * - We never expose private contact info without explicit consent
 */

export class GeneralAnswerOpenAIClient {
  static async callOpenAIAPI(systemPrompt: string, message: string): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        model: 'gpt-4',
        stream: false,
        temperature: 0.7
      })
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenAI API error:', response.status, errorText)
      throw new Error(`OpenAI API error: ${response.status}`)
    }
    
    const data = await response.json()
    return data.choices?.[0]?.message?.content || 'No response from OpenAI'
  }
}



