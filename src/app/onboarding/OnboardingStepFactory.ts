// OnboardingStepFactory.ts (20 lines) - Step creation factory
import type { OnboardingStep } from './Onboarding.types'
import { ONBOARDING_STEP_DATA } from './OnboardingStepDefinitions'

export function createOnboardingSteps(callbacks: any): OnboardingStep[] {
  return ONBOARDING_STEP_DATA.map(stepData => ({
    ...stepData,
    isCompleted: false
  }))
}

