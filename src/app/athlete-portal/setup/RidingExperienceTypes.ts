export type { RidingExperienceFormData, RidingExperienceFieldProps } from './RidingExperienceFieldTypes'
export type { RidingExperienceStepProps, RidingExperienceStepState, RidingExperienceStepActions } from './RidingExperienceStepTypes'
export { SKILL_LEVELS, COMPETITION_LEVELS, RIDING_DISCIPLINES } from './RidingExperienceConstants'

export interface RidingExperienceFormProps {
  formData: any
  setFormData?: React.Dispatch<React.SetStateAction<any>>
  updateField: (field: string, value: any) => void
  onNext: () => void
  onBack: () => void
  isValid: boolean
  isSaving: boolean
}

export interface RidingExperienceActionsProps {
  onNext: () => void
  onBack: () => void
  isValid: boolean
  isSaving: boolean
}