'use client'

import { useOnboarding } from './useOnboarding'
import { OnboardingView } from './Onboarding.view'

export default function OnboardingPage() {
  const vm = useOnboarding()
  return <OnboardingView {...vm} />
}
