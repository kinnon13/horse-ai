import { Button } from '@/components/ui/Button'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { OnboardingVM } from './useOnboarding'

export function Navigation({ currentStepData, canGoNext, onPrevious, onNext, onStepSelect }: Pick<OnboardingVM, 'currentStepData' | 'canGoNext' | 'onPrevious' | 'onNext' | 'onStepSelect'>) {
  return (
    <div className="flex justify-between">
      <Button variant="outline" onClick={onPrevious} disabled={currentStepData?.index === 0}>
        <ArrowLeft className="w-4 h-4 mr-2" />Previous
      </Button>
      <div className="flex space-x-2">
        {currentStepData?.stepDots?.map((dot, index) => (
          <button key={index} onClick={() => onStepSelect(index)} className={`w-3 h-3 rounded-full transition-colors ${dot}`} />
        ))}
      </div>
      {currentStepData?.showNext && (
        <Button onClick={onNext} disabled={!canGoNext}>Next<ArrowRight className="w-4 h-4 ml-2" /></Button>
      )}
    </div>
  )
}

