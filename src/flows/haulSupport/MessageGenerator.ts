// MessageGenerator.ts (35 lines) - Single responsibility: Main message generation logic
import { MessageFormatters } from './MessageFormatters'

export class MessageGenerator {
  /**
   * PURPOSE:
   * - Generates haul support message based on available points
   * - Provides safety-focused recommendations
   * 
   * SAFETY:
   * - We emphasize safety over convenience
   * - We provide clear safety warnings
   */
  static generateHaulSupportMessage(
    supportPoints: any,
    safetyRanking: 'high' | 'medium' | 'low'
  ): string {
    let message = ''
    
    message += MessageFormatters.formatSafetyHeader(safetyRanking)
    message += MessageFormatters.formatSupportPoints(supportPoints)
    message += MessageFormatters.formatSafetyFooter()
    
    return message
  }
}
