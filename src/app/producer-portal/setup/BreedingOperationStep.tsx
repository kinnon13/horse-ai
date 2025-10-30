import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { BreedingOperationStepProps } from './BreedingOperationTypes'
import { BreedingOperationHeader } from './BreedingOperationHeader'
import { BreedingOperationForm } from './BreedingOperationForm'
import { BreedingOperationActions } from './BreedingOperationActions'
import { useBreedingOperationStep } from './useBreedingOperationStep'

export function BreedingOperationStep({ formData, setFormData, onNext, onBack }: BreedingOperationStepProps) {
  const {
    isValid,
    isSaving,
    updateField,
    goNext,
    goBack
  } = useBreedingOperationStep(formData, setFormData, onNext, onBack)

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <BreedingOperationHeader />
        <p className="text-gray-600">Tell us about your breeding operation</p>
      </CardHeader>
      <CardContent>
        <BreedingOperationForm
          formData={formData}
          updateField={updateField}
        />
        <BreedingOperationActions
          onNext={goNext}
          onBack={goBack}
          isValid={isValid}
          isSaving={isSaving}
        />
      </CardContent>
    </Card>
  )
}