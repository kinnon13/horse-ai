import { OnboardingIntent } from './OnboardingParser'
import { Templates as OnboardingResponseTemplates } from './Templates'
import { OnboardingResponse } from './OnboardingResponseTemplates.types'

export type { OnboardingResponse }

export class OnboardingResponseGenerator {
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
