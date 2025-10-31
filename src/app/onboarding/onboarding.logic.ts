import type { OnboardingVM } from './useOnboarding'
import type { OnboardingStep } from './Onboarding.types'

export function buildOnboardingVM({
  loading,
  user,
  currentStep,
  steps,
  completedSteps,
  setCurrentStep
}: {
  loading: boolean
  user: any
  currentStep: number
  steps: OnboardingStep[]
  completedSteps: string[]
  setCurrentStep: (step: number | ((prev: number) => number)) => void
}): OnboardingVM {
  const currentStepData = {
    step: steps[currentStep],
    index: currentStep,
    totalSteps: steps.length,
    showNext: currentStep < steps.length - 1,
    stepDots: steps.map((_, index) => {
      if (index === currentStep) return 'bg-primary-600'
      if (completedSteps.includes(steps[index].id)) return 'bg-green-500'
      return 'bg-gray-300'
    })
  }

  const progress = ((currentStep + 1) / steps.length) * 100

  return {
    loading,
    user,
    currentStepData,
    progress,
    completedSteps,
    onPrevious: () => setCurrentStep(Math.max(0, currentStep - 1)),
    onNext: () => setCurrentStep(currentStep + 1),
    onStepSelect: (index: number) => setCurrentStep(index),
    canGoNext: completedSteps.includes(currentStepData.step.id)
  }
}




