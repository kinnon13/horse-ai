import type { OnboardingVM } from './useOnboarding'

export function ProgressBar({ progress, currentStepData }: Pick<OnboardingVM, 'progress' | 'currentStepData'>) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">
          Step {currentStepData?.index + 1} of {currentStepData?.totalSteps}
        </span>
        <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className="bg-primary-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}

