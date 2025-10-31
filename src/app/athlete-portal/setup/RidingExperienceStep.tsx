import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { RidingExperienceStepProps } from './RidingExperienceTypes'
import { RidingExperienceHeader } from './RidingExperienceHeader'
import { RidingExperienceForm } from './RidingExperienceForm'
import { RidingExperienceActions } from './RidingExperienceActions'
import { useRidingExperienceStep } from './useRidingExperienceStep'

export function RidingExperienceStep({ formData, updateField, onNext, onBack }: RidingExperienceStepProps) {
  const {
    isValid,
    isSaving,
    updateField: hookUpdateField,
    goNext,
    goBack
  } = useRidingExperienceStep(formData, undefined, onNext, onBack)

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <RidingExperienceHeader />
        <p className="text-gray-600">Tell us about your riding background</p>
      </CardHeader>
      <CardContent>
        <RidingExperienceForm
          formData={formData}
          updateField={updateField || hookUpdateField}
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