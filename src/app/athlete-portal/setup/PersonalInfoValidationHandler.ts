import { AthleteSetupData } from './AthleteSetupTypes'
import { validatePersonalInfoForm } from './PersonalInfoValidation'

export function validatePersonalInfo(
  formData: AthleteSetupData,
  setErrors: (errors: Record<string, string>) => void
): boolean {
  const newErrors = validatePersonalInfoForm(formData)
  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}

