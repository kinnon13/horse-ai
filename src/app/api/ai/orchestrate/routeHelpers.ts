import { callGrok, callOpenAI, callGemini, callPerplexity } from './helpers';

export async function getAIResponse(prompt: string): Promise<{response: string, provider: string}> {
  try {
    return { response: await callGrok(prompt), provider: 'grok' };
  } catch {
    try {
      return { response: await callOpenAI(prompt), provider: 'openai' };
    } catch {
      try {
        return { response: await callGemini(prompt), provider: 'gemini' };
      } catch {
        try {
          return { response: await callPerplexity(prompt), provider: 'perplexity' };
        } catch {
          throw new Error('All AI providers failed');
        }
      }
    }
  }
}

