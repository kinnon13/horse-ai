// Database: transaction handling
import { ProducerSetupData } from './ProducerSetupTypes'

export interface BusinessInfoStepProps {
  formData: ProducerSetupData
  setFormData: (data: ProducerSetupData) => void
  onNext: () => void
}

export interface BusinessInfoFormProps {
  formData: ProducerSetupData
  updateField: (field: keyof ProducerSetupData, value: any) => void
}

export interface BusinessInfoActionsProps {
  onNext: () => void
  isValid: boolean
  isSaving: boolean
}

export interface BusinessInfoStepState {
  formData: ProducerSetupData
  isValid: boolean
  isSaving: boolean
  errors: Record<string, string>
}

export interface BusinessInfoStepActions {
  updateField: (field: keyof ProducerSetupData, value: any) => void
  goNext: () => void
  validateForm: () => boolean
  saveData: () => Promise<void>
}

