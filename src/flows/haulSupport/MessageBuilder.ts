// MessageBuilder.ts (35 lines) - Single responsibility: Main message building logic
import { MessageTemplates } from './MessageTemplates'

export class MessageBuilder {
  /**
   * PURPOSE:
   * - Builds haul support messages based on available points
   * - Provides safety-focused recommendations
   * 
   * SAFETY:
   * - We emphasize safety over convenience
   * - We provide clear safety warnings
   */
  static buildHaulSupportMessage(
    supportPoints: any,
    safetyRanking: 'high' | 'medium' | 'low'
  ): string {
    let message = ''
    
    message += MessageTemplates.getSafetyHeader(safetyRanking)
    message += MessageTemplates.getSupportPointsSummary(supportPoints)
    message += MessageTemplates.getSafetyFooter()
    
    return message
  }
}
