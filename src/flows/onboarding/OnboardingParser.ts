/**
 * ONBOARDING MESSAGE PARSER
 * 
 * PURPOSE:
 * - Parses onboarding messages to extract structured data
 * - Handles various ways users might express their situation
 * 
 * SAFETY:
 * - Only extracts data that users explicitly provide
 * - Does not make assumptions about user intent
 */

import { OnboardingDataExtractors } from './OnboardingDataExtractors'

export interface OnboardingIntent {
  type: 'onboarding'
  step: 'greeting' | 'horse_count' | 'roles' | 'preferences' | 'complete'
  data: {
    horseCount?: number
    roles?: string[]
    sponsorCode?: string
    wantsOutreach?: boolean
    wantsOptions?: boolean
  }
}

export class OnboardingParser {
  /**
   * PURPOSE:
   * - Parses onboarding messages to extract structured data
   * - Handles various ways users might express their situation
   * 
   * SAFETY:
   * - Only extracts data that users explicitly provide
   * - Does not make assumptions about user intent
   */
  static parseOnboardingMessage(message: string): OnboardingIntent {
    const lowerMessage = message.toLowerCase()
    
    const horseCount = OnboardingDataExtractors.extractHorseCount(lowerMessage)
    const roles = OnboardingDataExtractors.extractRoles(lowerMessage)
    const sponsorCode = OnboardingDataExtractors.extractSponsorCode(message)
    const step = this.determineStep(horseCount, roles, sponsorCode)
    
    return {
      type: 'onboarding',
      step,
      data: { horseCount, roles, sponsorCode }
    }
  }

  private static determineStep(
    horseCount: number | undefined,
    roles: string[],
    sponsorCode: string | undefined
  ): OnboardingIntent['step'] {
    if (sponsorCode) return 'preferences'
    if (roles.length > 0) return 'roles'
    if (horseCount !== undefined) return 'horse_count'
    return 'greeting'
  }
}
