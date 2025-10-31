/**
 * ONBOARDING RESPONSE TEMPLATES TYPES
 * 
 * PURPOSE:
 * - Type definitions for onboarding response templates
 * - Defines the structure of response objects
 * 
 * SAFETY:
 * - Always asks permission before storing personal info
 * - Explains what we'll do with the data
 * - Gives users control over their information
 */

export interface OnboardingResponse {
  message: string
  nextStep?: string
  requiresInput?: boolean
  inputType?: 'number' | 'choice' | 'text'
  choices?: string[]
  complete?: boolean
}

export interface OnboardingStep {
  step: string
  requiresInput: boolean
  inputType: 'number' | 'choice' | 'text'
  choices?: string[]
}
