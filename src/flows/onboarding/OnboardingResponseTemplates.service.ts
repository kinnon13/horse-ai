/**
 * ONBOARDING RESPONSE TEMPLATES SERVICE
 * 
 * PURPOSE:
 * - Contains response templates for each onboarding step
 * - Provides consistent messaging across onboarding flow
 * 
 * SAFETY:
 * - Always asks permission before storing personal info
 * - Explains what we'll do with the data
 * - Gives users control over their information
 */

import { OnboardingResponse } from './OnboardingResponseTemplates.types'
import { OnboardingResponseHelpers } from './OnboardingResponseTemplates.helpers'

export class OnboardingResponseTemplatesService {
  static getGreetingResponse(): OnboardingResponse {
    return OnboardingResponseHelpers.createGreetingResponse()
  }

  static getHorseCountResponse(horseCount: number): OnboardingResponse {
    return OnboardingResponseHelpers.createHorseCountResponse(horseCount)
  }

  static getRolesResponse(roles: string[]): OnboardingResponse {
    return OnboardingResponseHelpers.createRolesResponse(roles)
  }

  static getPreferencesResponse(): OnboardingResponse {
    return OnboardingResponseHelpers.createPreferencesResponse()
  }

  static getDefaultResponse(): OnboardingResponse {
    return OnboardingResponseHelpers.createDefaultResponse()
  }
}