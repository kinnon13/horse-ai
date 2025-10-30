import { useState } from 'react'
import { AthleteSetupData } from './AthleteSetupTypes'
import { RidingExperienceStepState } from './RidingExperienceTypes'

export function useRidingExperienceState(initialData: AthleteSetupData) {
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  return {
    formData: initialData,
    isSaving,
    errors,
    setIsSaving,
    setErrors
  }
}

