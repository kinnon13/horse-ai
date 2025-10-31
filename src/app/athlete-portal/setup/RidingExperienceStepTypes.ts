import { RidingExperienceFormData } from './RidingExperienceFieldTypes'

export interface RidingExperienceStepProps {
  formData: {
    skill_level: string
    competition_level: string
    primary_disciplines: string[]
    years_experience: number
    training_hours_per_week: number
    competition_frequency: string
    goals: string[]
    challenges: string[]
    preferred_training_style: string
    availability: string[]
  }
  updateField: (field: string, value: any) => void
  onNext: () => void
  onBack: () => void
  isValid: boolean
  isSaving: boolean
}

export interface RidingExperienceStepState {
  formData: RidingExperienceFormData
  errors: Record<string, string>
  isValid: boolean
  isSaving: boolean
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>
}

export interface RidingExperienceStepActions {
  updateField: (field: string, value: any) => void
  goNext: () => void
  goBack: () => void
}


