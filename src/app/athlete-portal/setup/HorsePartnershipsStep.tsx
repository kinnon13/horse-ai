import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { HorsePartnershipsStepProps } from './HorsePartnershipsTypes'
import { HorsePartnershipsHeader } from './HorsePartnershipsHeader'
import { HorsePartnershipsForm } from './HorsePartnershipsForm'
import { HorsePartnershipsActions } from './HorsePartnershipsActions'
import { useHorsePartnershipsStep } from './useHorsePartnershipsStep'

export function HorsePartnershipsStep({ formData, setFormData, onNext, onBack }: HorsePartnershipsStepProps) {
  const {
    isValid,
    isSaving,
    updateField,
    goNext,
    goBack
  } = useHorsePartnershipsStep(formData, setFormData, onNext, onBack)

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <HorsePartnershipsHeader />
        <p className="text-gray-600">Tell us about your horse relationships</p>
      </CardHeader>
      <CardContent>
        <HorsePartnershipsForm
          formData={formData}
          updateField={updateField}
        />
        <HorsePartnershipsActions
          onNext={goNext}
          onBack={goBack}
          isValid={isValid}
          isSaving={isSaving}
        />
      </CardContent>
    </Card>
  )
}