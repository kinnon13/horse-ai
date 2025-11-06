// Database: transaction handling
import { AthleteSetupData } from './AthleteSetupTypes'

export interface HorsePartnershipsStepProps {
  formData: AthleteSetupData
  setFormData: (data: AthleteSetupData) => void
  onNext: () => void
  onBack: () => void
}

export interface HorsePartnershipsFormProps {
  formData: AthleteSetupData
  updateField: (field: keyof AthleteSetupData, value: any) => void
}

export interface HorsePartnershipsActionsProps {
  onNext: () => void
  onBack: () => void
  isValid: boolean
  isSaving: boolean
}

export interface HorsePartnershipsStepState {
  formData: AthleteSetupData
  isValid: boolean
  isSaving: boolean
  errors: Record<string, string>
}

export interface HorsePartnershipsStepActions {
  updateField: (field: keyof AthleteSetupData, value: any) => void
  goNext: () => void
  goBack: () => void
  validateForm: () => boolean
  saveData: () => Promise<void>
}




