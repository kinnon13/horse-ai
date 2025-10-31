import { OnboardingResponse } from './OnboardingResponseTemplates.types'

export function getRolesResponse(roles: string[]): OnboardingResponse {
  const roleText = roles.join(', ')
  return {
    message: `Perfect! I can see you're involved as: ${roleText}. This helps me give you more relevant advice.`,
    nextStep: 'horse_count',
    requiresInput: true,
    inputType: 'number',
    choices: ['1', '2', '3', '4', '5+']
  }
}

export function getPreferencesResponse(): OnboardingResponse {
  return {
    message: "Almost done! Let's set up your preferences so I can give you the most relevant information.",
    nextStep: 'complete',
    requiresInput: true,
    inputType: 'choice',
    choices: ['Set preferences', 'Skip for now']
  }
}


