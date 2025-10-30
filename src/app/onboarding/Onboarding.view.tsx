import { ProgressBar } from './ProgressBar'
import { StepCard } from './StepCard'
import { Navigation } from './Navigation'
import type { OnboardingVM } from './useOnboarding'

export function OnboardingView(vm: OnboardingVM) {
  if (vm.loading) return <LoadingView />
  if (!vm.user) return null
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <ProgressBar progress={vm.progress} currentStepData={vm.currentStepData} />
        <StepCard currentStepData={vm.currentStepData} completedSteps={vm.completedSteps} />
        <Navigation currentStepData={vm.currentStepData} canGoNext={vm.canGoNext} onPrevious={vm.onPrevious} onNext={vm.onNext} onStepSelect={vm.onStepSelect} />
      </div>
    </div>
  )
}

function LoadingView() {
  return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600" /></div>
}

