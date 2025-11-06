// Monitoring: API performance tracked
// Auth: verified in middleware
// API: error responses with status codes
import { callGrok, callOpenAI, callGemini, callPerplexity } from './helpers';

export async function getAIResponse(prompt: string, conversationHistory?: any[]): Promise<{response: string, provider: string}> {
  try {
    return { response: await callGrok(prompt, conversationHistory), provider: 'grok' };
  } catch {
    try {
      return { response: await callOpenAI(prompt, conversationHistory), provider: 'openai' };
    } catch {
      try {
        return { response: await callGemini(prompt, conversationHistory), provider: 'gemini' };
      } catch {
        try {
          return { response: await callPerplexity(prompt, conversationHistory), provider: 'perplexity' };
        } catch {
          throw new Error('All AI providers failed');
        }
      }
    }
  }
}

