import { AthleteSetupData } from './AthleteSetupTypes'
import { validateHorsePartnershipsForm } from './HorsePartnershipsValidation'

export function validateHorsePartnerships(
  formData: AthleteSetupData,
  setErrors: (errors: Record<string, string>) => void
): boolean {
  const newErrors = validateHorsePartnershipsForm(formData)
  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}




