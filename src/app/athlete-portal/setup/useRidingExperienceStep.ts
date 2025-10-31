import { AthleteSetupData } from './AthleteSetupTypes'
import { RidingExperienceStepState, RidingExperienceStepActions, RidingExperienceFormData } from './RidingExperienceTypes'
import { useRidingExperienceState } from './useRidingExperienceState'
import { useRidingExperienceActions } from './useRidingExperienceActions'

export function useRidingExperienceStep(
  initialData: RidingExperienceFormData | AthleteSetupData,
  setFormData: ((data: AthleteSetupData) => void) | undefined,
  onNext: () => void,
  onBack: () => void
): any {
  const state = useRidingExperienceState(initialData as any)
  const actions = useRidingExperienceActions(
    state.formData,
    setFormData as any,
    state.errors,
    state.setErrors,
    state.isSaving,
    state.setIsSaving,
    onNext,
    onBack
  )

  return {
    ...state,
    ...actions,
    isValid: true
  }
}