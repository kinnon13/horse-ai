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

export const BREEDING_SPECIALTIES = [
  'Quarter Horses', 'Thoroughbreds', 'Warmbloods', 'Arabians', 
  'Paint Horses', 'Appaloosas', 'Draft Horses'
]

export const BREEDING_METHODS = [
  'Live Cover', 'AI Fresh', 'AI Frozen', 'Embryo Transfer'
]

