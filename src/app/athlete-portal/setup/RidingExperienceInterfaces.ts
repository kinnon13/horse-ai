// Database: transaction handling
import { AthleteSetupData } from './AthleteSetupTypes'

export interface RidingExperienceStepProps {
  formData: AthleteSetupData
  setFormData: (data: AthleteSetupData) => void
  onNext: () => void
  onBack: () => void
}

export interface RidingExperienceFormProps {
  formData: AthleteSetupData
  updateField: (field: keyof AthleteSetupData, value: any) => void
}

export interface RidingExperienceActionsProps {
  onNext: () => void
  onBack: () => void
  isValid: boolean
  isSaving: boolean
}

export interface RidingExperienceStepState {
  formData: AthleteSetupData
  isValid: boolean
  isSaving: boolean
  errors: Record<string, string>
}

export interface RidingExperienceStepActions {
  updateField: (field: keyof AthleteSetupData, value: any) => void
  goNext: () => void
  goBack: () => void
  validateForm: () => boolean
  saveData: () => Promise<void>
}




