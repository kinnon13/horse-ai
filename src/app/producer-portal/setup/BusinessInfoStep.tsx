import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { BusinessInfoStepProps } from './BusinessInfoTypes'
import { BusinessInfoHeader } from './BusinessInfoHeader'
import { BusinessInfoForm } from './BusinessInfoForm'
import { BusinessInfoActions } from './BusinessInfoActions'
import { useBusinessInfoStep } from './useBusinessInfoStep'

export function BusinessInfoStep({ formData, setFormData, onNext }: BusinessInfoStepProps) {
  const {
    isValid,
    isSaving,
    updateField,
    goNext
  } = useBusinessInfoStep(formData, setFormData, onNext)

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <BusinessInfoHeader />
        <p className="text-gray-600">Tell us about your breeding operation</p>
      </CardHeader>
      <CardContent>
        <BusinessInfoForm
          formData={formData}
          updateField={updateField}
        />
        <BusinessInfoActions
          onNext={goNext}
          isValid={isValid}
          isSaving={isSaving}
        />
      </CardContent>
    </Card>
  )
}