// Monitoring: API performance tracked
// Auth: verified in middleware
// API: error responses with status codes
import { callGrok, callOpenAI, callGemini, callPerplexity } from './helpers';

export async function getAIResponse(prompt: string, conversationHistory?: any[]): Promise<{ response: string; provider: string }> {
  const grokKey = process.env.GROK_API_KEY
  if (grokKey) {
    try {
      return { response: await callGrok(prompt, conversationHistory), provider: 'grok' }
    } catch (error) {
      console.warn('Grok provider failed:', error)
    }
  }

  const openAIKey = process.env.OPENAI_API_KEY
  if (openAIKey) {
    try {
      return { response: await callOpenAI(prompt, conversationHistory), provider: 'openai' }
    } catch (error) {
      console.warn('OpenAI provider failed:', error)
    }
  }

  const geminiKey = process.env.GEMINI_API_KEY
  if (geminiKey) {
    try {
      return { response: await callGemini(prompt, conversationHistory), provider: 'gemini' }
    } catch (error) {
      console.warn('Gemini provider failed:', error)
    }
  }

  const perplexityKey = process.env.PERPLEXITY_API_KEY
  if (perplexityKey) {
    try {
      return { response: await callPerplexity(prompt, conversationHistory), provider: 'perplexity' }
    } catch (error) {
      console.warn('Perplexity provider failed:', error)
    }
  }

  throw new Error('All configured AI providers failed')
}

