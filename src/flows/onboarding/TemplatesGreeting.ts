import { OnboardingResponse } from './OnboardingResponseTemplates.types'

export function getGreetingResponse(): OnboardingResponse {
  return {
    message: "Welcome to HorseGPT! I'm here to help you with everything horse-related. Let's get started by learning a bit about your situation.",
    nextStep: 'roles',
    requiresInput: true,
    inputType: 'choice' as const,
    choices: ['I own horses', 'I ride horses', 'I am looking to buy', 'I breed horses', 'Other']
  }
}

export function getHorseCountResponse(horseCount: number): OnboardingResponse {
  return {
    message: `Great! You have ${horseCount} horse${horseCount > 1 ? 's' : ''}. Let me help you manage them better.`,
    nextStep: 'preferences',
    requiresInput: false
  }
}

