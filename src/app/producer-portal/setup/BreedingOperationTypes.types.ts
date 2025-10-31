// Breeding operation types
import { ProducerSetupData } from './ProducerSetupTypes'

export interface BreedingOperationStepProps {
  formData: ProducerSetupData
  setFormData: (data: ProducerSetupData) => void
  onNext: () => void
  onBack: () => void
}

export interface BreedingOperationFormProps {
  formData: ProducerSetupData
  updateField: (field: keyof ProducerSetupData, value: any) => void
}

export interface BreedingOperationActionsProps {
  onNext: () => void
  onBack: () => void
  isValid: boolean
  isSaving: boolean
}

export interface BreedingOperationStepState {
  formData: ProducerSetupData
  isValid: boolean
  isSaving: boolean
  errors: Record<string, string>
}

export interface BreedingOperationStepActions {
  updateField: (field: keyof ProducerSetupData, value: any) => void
  goNext: () => void
  goBack: () => void
  validateForm: () => boolean
  saveData: () => Promise<void>
}

export interface BreedingOperationFormData {
  operation_name: string
  location?: string
  specialties?: string[]
  breeding_policies?: string
  stud_fee?: number
  mare_care_services?: string[]
}
