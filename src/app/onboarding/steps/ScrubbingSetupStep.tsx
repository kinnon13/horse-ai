// ScrubbingSetupStep.tsx (35 lines) - Single responsibility: Main scrubbing setup
import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { ScrubbingOptions } from './ScrubbingOptions'
import { ScrubbingConfig } from './ScrubbingConfig'

interface ScrubbingSetupStepProps {
  onNext: () => void
  onBack: () => void
  onSetup?: (options: any) => void
}

export default function ScrubbingSetupStep({ onNext, onBack }: ScrubbingSetupStepProps) {
  const [scrubbingOptions, setScrubbingOptions] = useState({
    removeDuplicates: true,
    standardizeBreeds: true,
    validatePricing: true,
    cleanContactInfo: false
  })

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Data Scrubbing Setup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <p className="text-gray-600 text-center">
            Choose how you'd like to clean and organize your horse data
          </p>
          
          <ScrubbingOptions options={scrubbingOptions} onChange={setScrubbingOptions} />
          <ScrubbingConfig options={scrubbingOptions} onChange={setScrubbingOptions} />
        </div>
        
        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={onNext}>
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}