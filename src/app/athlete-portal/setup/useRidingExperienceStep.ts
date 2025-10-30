import { AthleteSetupData } from './AthleteSetupTypes'
import { RidingExperienceStepState, RidingExperienceStepActions } from './RidingExperienceTypes'
import { useRidingExperienceState } from './useRidingExperienceState'
import { useRidingExperienceActions } from './useRidingExperienceActions'

export function useRidingExperienceStep(
  initialData: AthleteSetupData,
  setFormData: (data: AthleteSetupData) => void,
  onNext: () => void,
  onBack: () => void
): RidingExperienceStepState & RidingExperienceStepActions {
  const state = useRidingExperienceState(initialData)
  const actions = useRidingExperienceActions(
    state.formData,
    setFormData,
    state.errors,
    state.setErrors,
    state.isSaving,
    state.setIsSaving,
    onNext,
    onBack
  )

  return {
    ...state,
    ...actions
  }
}