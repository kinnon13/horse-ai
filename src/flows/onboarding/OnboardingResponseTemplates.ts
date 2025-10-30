/**
 * ONBOARDING RESPONSE TEMPLATES
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

export class OnboardingResponseTemplates {
  static getGreetingResponse() {
    return {
      message: `Hey there! I'm HorseGPT. I help horse people find what they need - from farriers to haul routes to breeding info.\n\nTo get started, how many horses do you have?`,
      nextStep: 'horse_count',
      requiresInput: true,
      inputType: 'number' as const
    }
  }

  static getHorseCountResponse(horseCount: number) {
    return {
      message: `Got it - ${horseCount} horses. What do you do with them? Are you a rider, breeder, trainer, hauler, or something else?`,
      nextStep: 'roles',
      requiresInput: true,
      inputType: 'choice' as const,
      choices: ['Rider/Competitor', 'Breeder', 'Trainer', 'Hauler', 'Producer', 'Just Owner']
    }
  }

  static getRolesResponse(roles: string[]) {
    const roleText = roles.join(', ')
    return {
      message: `Perfect - so you're a ${roleText}. Here's how I can help:\n\n• Find providers (farriers, vets, trainers) in your area\n• Get haul routes with safe overnight stops\n• Look up breeding info and stud fees\n• Connect you with other horse people\n\nDo you want me to reach out to providers for you, or just give you options to contact yourself?`,
      nextStep: 'preferences',
      requiresInput: true,
      inputType: 'choice' as const,
      choices: ['Reach out for me', 'Just give me options', 'Depends on the situation']
    }
  }

  static getPreferencesResponse() {
    return {
      message: `Perfect! I've got your info saved. Now I can help you find what you need.\n\nWhat are you looking for today?`,
      complete: true
    }
  }

  static getDefaultResponse() {
    return {
      message: `Let's get you set up. How many horses do you have?`,
      nextStep: 'horse_count',
      requiresInput: true,
      inputType: 'number' as const
    }
  }
}



