import { AthleteSetupData } from './AthleteSetupTypes'

export function updateRidingExperienceField(
  formData: AthleteSetupData,
  setFormData: (data: AthleteSetupData) => void,
  field: keyof AthleteSetupData,
  value: any,
  errors: Record<string, string>,
  setErrors: (errors: Record<string, string>) => void
) {
  setFormData({ ...formData, [field]: value })
  // Clear error when user starts typing
  if (errors[field]) {
    setErrors({ ...errors, [field]: '' })
  }
}




