import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { RidingExperienceStepProps } from './RidingExperienceTypes'
import { RidingExperienceHeader } from './RidingExperienceHeader'
import { RidingExperienceForm } from './RidingExperienceForm'
import { RidingExperienceActions } from './RidingExperienceActions'
import { useRidingExperienceStep } from './useRidingExperienceStep'

export function RidingExperienceStep({ formData, setFormData, onNext, onBack }: RidingExperienceStepProps) {
  const {
    isValid,
    isSaving,
    updateField,
    goNext,
    goBack
  } = useRidingExperienceStep(formData, setFormData, onNext, onBack)

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <RidingExperienceHeader />
        <p className="text-gray-600">Tell us about your riding background</p>
      </CardHeader>
      <CardContent>
        <RidingExperienceForm
          formData={formData}
          updateField={updateField}
        />
        <RidingExperienceActions
          onNext={goNext}
          onBack={goBack}
          isValid={isValid}
          isSaving={isSaving}
        />
      </CardContent>
    </Card>
  )
}