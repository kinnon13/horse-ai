import { AthleteSetupData } from './AthleteSetupTypes'
import { validateRidingExperienceForm } from './RidingExperienceValidation'

export function validateRidingExperience(
  formData: AthleteSetupData,
  setErrors: (errors: Record<string, string>) => void
): boolean {
  const newErrors = validateRidingExperienceForm(formData)
  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}




