import { useState } from 'react'
import { AthleteSetupData } from './AthleteSetupTypes'
import { HorsePartnershipsStepState } from './HorsePartnershipsTypes'

export function useHorsePartnershipsState(initialData: AthleteSetupData) {
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




