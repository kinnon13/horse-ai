// TemplateResponseHelpers.ts (30 lines) - Response creation helpers
import { OnboardingResponse } from './OnboardingResponseTemplates.types'

export class TemplateResponseHelpers {
  static createGreetingResponse(): OnboardingResponse {
    return {
      message: "Welcome to HorseGPT! I'm here to help you with everything horse-related. Let's get started by learning a bit about your situation.",
      nextStep: 'roles',
      requiresInput: true,
      inputType: 'choice' as const,
      choices: ['I own horses', 'I ride horses', 'I am looking to buy', 'I breed horses', 'Other']
    }
  }

  static createHorseCountResponse(horseCount: number): OnboardingResponse {
    return {
      message: `Great! You have ${horseCount} horse${horseCount > 1 ? 's' : ''}. Let me help you manage them better.`,
      nextStep: 'preferences',
      requiresInput: false
    }
  }

  static createDefaultResponse(): OnboardingResponse {
    return {
      message: "I'm not sure what you mean. Could you try again?",
      nextStep: 'greeting',
      requiresInput: true,
      inputType: 'text' as const
    }
  }
}
