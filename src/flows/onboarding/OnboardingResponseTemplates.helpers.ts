import { OnboardingResponse } from './OnboardingResponseTemplates.types'

export class OnboardingResponseHelpers {
  static createGreetingResponse(): OnboardingResponse {
    return {
      message: `Hey there! I'm HorseGPT. I help horse people find what they need - from farriers to haul routes to breeding info.\n\nTo get started, how many horses do you have?`,
      nextStep: 'horse_count',
      requiresInput: true,
      inputType: 'number' as const
    }
  }

  static createHorseCountResponse(horseCount: number): OnboardingResponse {
    return {
      message: `Got it - ${horseCount} horses. What do you do with them? Are you a rider, breeder, trainer, hauler, or something else?`,
      nextStep: 'roles',
      requiresInput: true,
      inputType: 'choice' as const,
      choices: ['Rider/Competitor', 'Breeder', 'Trainer', 'Hauler', 'Producer', 'Just Owner']
    }
  }

  static createRolesResponse(roles: string[]): OnboardingResponse {
    const roleText = roles.join(', ')
    return {
      message: `Perfect - so you're a ${roleText}. Here's how I can help:\n\n• Find providers (farriers, vets, trainers) in your area\n• Get haul routes with safe overnight stops\n• Look up breeding info and stud fees\n• Connect you with other horse people\n\nDo you want me to reach out to providers for you, or just give you options to contact yourself?`,
      nextStep: 'preferences',
      requiresInput: true,
      inputType: 'choice' as const,
      choices: ['Reach out for me', 'Just give me options', 'Depends on the situation']
    }
  }

  static createPreferencesResponse(): OnboardingResponse {
    return {
      message: `Perfect! I've got your info saved. Now I can help you find what you need.\n\nWhat are you looking for today?`,
      complete: true
    }
  }

  static createDefaultResponse(): OnboardingResponse {
    return {
      message: `Let's get you set up. How many horses do you have?`,
      nextStep: 'horse_count',
      requiresInput: true,
      inputType: 'number' as const
    }
  }
}
