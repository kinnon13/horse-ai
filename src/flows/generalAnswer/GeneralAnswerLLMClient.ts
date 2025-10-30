/**
 * GENERAL ANSWER LLM CLIENT
 * 
 * PURPOSE:
 * - Generates answers using LLM API
 * - Provides tier-appropriate responses
 * 
 * SAFETY:
 * - We gate sensitive information behind Plus tier
 * - We never expose private contact info without explicit consent
 */

import { GeneralAnswerAPIClients } from './GeneralAnswerAPIClients'

export class GeneralAnswerLLMClient {
  /**
   * PURPOSE:
   * - Generates answers using LLM API
   * - Provides tier-appropriate responses
   * 
   * SAFETY:
   * - We gate sensitive information behind Plus tier
   * - We never expose private contact info without explicit consent
   */
  static async generateAnswer(
    message: string,
    horseContext?: string,
    userTier?: string
  ): Promise<string> {
    return GeneralAnswerAPIClients.generateAnswer(message, horseContext, userTier)
  }
}
