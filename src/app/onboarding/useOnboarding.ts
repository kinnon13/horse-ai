import { useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import type { OnboardingStep, OnboardingData } from './Onboarding.types'
import { ONBOARDING_STEPS } from './Onboarding.constants'
import { buildOnboardingVM } from './onboarding.logic'

export interface OnboardingVM {
  loading: boolean
  user: any
  currentStepData: any
  progress: number
  completedSteps: string[]
  onPrevious: () => void
  onNext: () => void
  onStepSelect: (index: number) => void
  canGoNext: boolean
}

export function useOnboarding(): OnboardingVM {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({})

  const steps: OnboardingStep[] = ONBOARDING_STEPS({
    currentStep,
    setCurrentStep,
    onboardingData,
    setOnboardingData,
    completedSteps,
    setCompletedSteps,
    router
  })

  return buildOnboardingVM({
    loading,
    user,
    currentStep,
    steps,
    completedSteps,
    setCurrentStep
  })
}

