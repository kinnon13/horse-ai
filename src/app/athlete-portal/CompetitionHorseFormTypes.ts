// CompetitionHorseFormTypes.ts (30 lines) - Single responsibility: Type definitions
import { CompetitionHorse } from './AthleteHorseTypes'

export interface CompetitionHorseFormModalProps {
  horse?: CompetitionHorse
  onSave: (horse: CompetitionHorse) => void
  onClose: () => void
}

export interface CompetitionHorseFormData {
  name: string
  breed: string
  age: string
  gender: string
  color: string
  height: string
  weight: string
  registration_number: string
  owner_name: string
  owner_phone: string
  owner_email: string
  trainer_name: string
  trainer_phone: string
  trainer_email: string
  notes: string
}

export interface CompetitionHorseFormState {
  formData: CompetitionHorseFormData
  errors: Record<string, string>
  isSubmitting: boolean
  setFormData: (data: Partial<CompetitionHorseFormData>) => void
  setError: (field: string, error: string) => void
  clearErrors: () => void
  validateForm: () => boolean
}