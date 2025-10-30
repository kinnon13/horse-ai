import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { PersonalInfoStepProps } from './PersonalInfoTypes'
import { PersonalInfoHeader } from './PersonalInfoHeader'
import { PersonalInfoForm } from './PersonalInfoForm'
import { PersonalInfoActions } from './PersonalInfoActions'
import { usePersonalInfoStep } from './usePersonalInfoStep'

export function PersonalInfoStep({ formData, setFormData, onNext }: PersonalInfoStepProps) {
  const {
    isValid,
    isSaving,
    updateField,
    goNext
  } = usePersonalInfoStep(formData, setFormData, onNext)

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <PersonalInfoHeader />
        <p className="text-gray-600">Tell us about yourself as a rider</p>
      </CardHeader>
      <CardContent>
        <PersonalInfoForm
          formData={formData}
          updateField={updateField}
        />
        <PersonalInfoActions
          onNext={goNext}
          isValid={isValid}
          isSaving={isSaving}
        />
      </CardContent>
    </Card>
  )
}