/**
 * ONBOARDING RESPONSE GENERATOR
 * 
 * PURPOSE:
 * - Generates appropriate onboarding responses
 * - Guides users through the onboarding process
 * - Asks for explicit permission before storing data
 * 
 * SAFETY:
 * - Always asks permission before storing personal info
 * - Explains what we'll do with the data
 * - Gives users control over their information
 */

import { OnboardingIntent } from './OnboardingParser'
import { OnboardingResponseTemplates } from './OnboardingResponseTemplates'

export interface OnboardingResponse {
  message: string
  nextStep?: string
  requiresInput?: boolean
  inputType?: 'number' | 'text' | 'choice'
  choices?: string[]
  complete?: boolean
}

export class OnboardingResponseGenerator {
  /**
   * PURPOSE:
   * - Generates appropriate onboarding responses
   * - Guides users through the onboarding process
   * - Asks for explicit permission before storing data
   * 
   * SAFETY:
   * - Always asks permission before storing personal info
   * - Explains what we'll do with the data
   * - Gives users control over their information
   */
  static generateOnboardingResponse(intent: OnboardingIntent): OnboardingResponse {
    switch (intent.step) {
      case 'greeting':
        return OnboardingResponseTemplates.getGreetingResponse()
      case 'horse_count':
        return OnboardingResponseTemplates.getHorseCountResponse(intent.data.horseCount!)
      case 'roles':
        return OnboardingResponseTemplates.getRolesResponse(intent.data.roles!)
      case 'preferences':
        return OnboardingResponseTemplates.getPreferencesResponse()
      default:
        return OnboardingResponseTemplates.getDefaultResponse()
    }
  }
}
