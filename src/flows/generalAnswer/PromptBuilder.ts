// PromptBuilder.ts (35 lines) - Single responsibility: Main prompt building logic
/**
 * GENERAL ANSWER SYSTEM PROMPT BUILDER
 * 
 * PURPOSE:
 * - Builds system prompts for LLM API calls
 * - Provides tier-appropriate prompts
 * 
 * SAFETY:
 * - We gate sensitive information behind Plus tier
 * - We never expose private contact info without explicit consent
 */

import { PromptTemplates } from './PromptTemplates'

export class PromptBuilder {
  static buildSystemPrompt(userTier?: string, horseContext?: string): string {
    let systemPrompt = PromptTemplates.getBasePrompt()
    
    if (userTier === 'free' || userTier === 'guest') {
      systemPrompt += PromptTemplates.getTierRestrictions()
    }
    
    if (horseContext) {
      systemPrompt += `\n\n${horseContext}\n\nUse this horse information to give specific, informed answers about bloodlines, performance, and value.`
    }
    
    return systemPrompt
  }

  static buildContextualPrompt(question: string, userTier?: string): string {
    const basePrompt = this.buildSystemPrompt(userTier)
    return `${basePrompt}\n\nUser question: ${question}`
  }

  static buildTierUpgradePrompt(question: string): string {
    return `I can help with that, but I need to upgrade you to HorseGPT+ for detailed information. Would you like me to upgrade you?`
  }
}


