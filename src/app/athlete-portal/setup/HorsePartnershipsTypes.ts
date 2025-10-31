// Horse Partnerships Types - Single responsibility
export interface HorsePartnershipsFormProps {
  formData: {
    partnership_type: string
    horse_ownership: string
    training_arrangements: string
    competition_sharing: string
    financial_arrangements: string
    responsibilities: string[]
    communication_preferences: string
    contract_terms: string
    rides_for_others: boolean
  }
  updateField: (field: string, value: any) => void
}

export interface HorsePartnershipsStepProps {
  formData: any
  updateField: (field: string, value: any) => void
  goNext: () => void
  goBack: () => void
  isValid: boolean
}

export interface HorsePartnershipsActionsProps {
  onNext: () => void
  onBack: () => void
  isValid: boolean
  isSaving: boolean
}

export interface HorsePartnershipsStepState {
  formData: any
  isValid: boolean
  errors: Record<string, string>
  isSaving: boolean
}

export interface HorsePartnershipsStepActions {
  updateField: (field: string, value: any) => void
  goNext: () => void
  goBack: () => void
  validateForm: () => boolean
}