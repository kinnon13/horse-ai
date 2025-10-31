/**
 * ONBOARDING RESPONSE TEMPLATES
 */
import { getGreetingResponse, getHorseCountResponse } from './TemplatesGreeting'
import { getRolesResponse, getPreferencesResponse } from './TemplatesUserFlow'

export class Templates {
  static getGreetingResponse() {
    return getGreetingResponse()
  }

  static getHorseCountResponse(horseCount: number) {
    return getHorseCountResponse(horseCount)
  }

  static getRolesResponse(roles: string[]) {
    return getRolesResponse(roles)
  }

  static getPreferencesResponse() {
    return getPreferencesResponse()
  }

  static getDefaultResponse() {
    return {
      message: "Welcome to HorseGPT! Let's get you set up. How many horses do you have?",
      nextStep: 'horse_count',
      requiresInput: true,
      inputType: 'number' as const
    }
  }
}

