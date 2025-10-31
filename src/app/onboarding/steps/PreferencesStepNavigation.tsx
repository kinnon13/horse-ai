// PreferencesStepNavigation.tsx (15 lines) - Navigation buttons
import React from 'react'
import { Button } from '@/components/ui/Button'

interface PreferencesStepNavigationProps {
  onBack: () => void
  onNext: () => void
}

export function PreferencesStepNavigation({ onBack, onNext }: PreferencesStepNavigationProps) {
  return (
    <div className="flex justify-between">
      <Button variant="outline" onClick={onBack}>
        Back
      </Button>
      <Button onClick={onNext}>
        Continue
      </Button>
    </div>
  )
}
