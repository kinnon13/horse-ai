import { AthleteSetupData } from './AthleteSetupTypes'
import { CONTACT_PREFERENCES, ALLOWED_COUNTRIES } from './PersonalInfoConstants'

export interface PersonalInfoStepProps {
  formData: AthleteSetupData
  setFormData: (data: AthleteSetupData) => void
  onNext: () => void
}

export interface PersonalInfoFormProps {
  formData: AthleteSetupData
  updateField: (field: keyof AthleteSetupData, value: any) => void
}

export interface PersonalInfoActionsProps {
  onNext: () => void
  isValid: boolean
  isSaving: boolean
}

export interface PersonalInfoStepState {
  formData: AthleteSetupData
  isValid: boolean
  isSaving: boolean
  errors: Record<string, string>
}

export interface PersonalInfoStepActions {
  updateField: (field: keyof AthleteSetupData, value: any) => void
  goNext: () => void
  validateForm: () => boolean
  saveData: () => Promise<void>
}

export { CONTACT_PREFERENCES, ALLOWED_COUNTRIES } from './PersonalInfoConstants'

