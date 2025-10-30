/**
 * GENERAL ANSWER API CLIENTS
 * 
 * PURPOSE:
 * - Handles API calls to Grok and OpenAI
 * - Provides fallback between different LLM providers
 * 
 * SAFETY:
 * - We gate sensitive information behind Plus tier
 * - We never expose private contact info without explicit consent
 */

import { GeneralAnswerSystemPromptBuilder } from './GeneralAnswerSystemPromptBuilder'
import { GeneralAnswerGrokClient } from './GeneralAnswerGrokClient'
import { GeneralAnswerOpenAIClient } from './GeneralAnswerOpenAIClient'

export class GeneralAnswerAPIClients {
  static async generateAnswer(
    message: string,
    horseContext?: string,
    userTier?: string
  ): Promise<string> {
    
    const systemPrompt = GeneralAnswerSystemPromptBuilder.buildSystemPrompt(userTier, horseContext)
    
    // Try Grok first, fallback to OpenAI
    if (process.env.GROK_API_KEY) {
      return GeneralAnswerGrokClient.callGrokAPI(systemPrompt, message)
    } else if (process.env.OPENAI_API_KEY) {
      return GeneralAnswerOpenAIClient.callOpenAIAPI(systemPrompt, message)
    } else {
      throw new Error('No LLM API key configured')
    }
  }
}