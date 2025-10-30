import { AthleteSetupData } from './AthleteSetupTypes'
import { HorsePartnershipsStepState, HorsePartnershipsStepActions } from './HorsePartnershipsTypes'
import { useHorsePartnershipsState } from './useHorsePartnershipsState'
import { useHorsePartnershipsActions } from './useHorsePartnershipsActions'

export function useHorsePartnershipsStep(
  initialData: AthleteSetupData,
  setFormData: (data: AthleteSetupData) => void,
  onNext: () => void,
  onBack: () => void
): HorsePartnershipsStepState & HorsePartnershipsStepActions {
  const state = useHorsePartnershipsState(initialData)
  const actions = useHorsePartnershipsActions(
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