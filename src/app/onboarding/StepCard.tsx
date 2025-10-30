import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { CheckCircle } from 'lucide-react'
import type { OnboardingVM } from './useOnboarding'

export function StepCard({ currentStepData, completedSteps }: Pick<OnboardingVM, 'currentStepData' | 'completedSteps'>) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          {currentStepData?.step.title}
          {completedSteps.includes(currentStepData?.step.id || '') && <CheckCircle className="w-5 h-5 text-green-500 ml-2" />}
        </CardTitle>
        <p className="text-gray-600">{currentStepData?.step.description}</p>
      </CardHeader>
      <CardContent>{currentStepData?.step.component}</CardContent>
    </Card>
  )
}

