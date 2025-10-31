// ParserTypes.ts (35 lines) - Single responsibility: Type definitions
export interface OnboardingIntent {
  type: 'onboarding'
  step: 'greeting' | 'roles' | 'horse_count' | 'preferences' | 'complete'
  data: OnboardingData
}

export interface OnboardingData {
  horseCount?: number
  roles: string[]
  sponsorCode?: string
}

export interface OnboardingParseResult {
  success: boolean
  intent?: OnboardingIntent
  error?: string
}

export type OnboardingStep = 'greeting' | 'roles' | 'horse_count' | 'preferences' | 'complete'

export interface OnboardingContext {
  userId: string
  currentStep: OnboardingStep
  completedSteps: OnboardingStep[]
  data: OnboardingData
}


