import { AthleteSetupData } from './AthleteSetupTypes'
import { PersonalInfoStepState, PersonalInfoStepActions } from './PersonalInfoTypes'
import { usePersonalInfoState } from './usePersonalInfoState'
import { usePersonalInfoActions } from './usePersonalInfoActions'

export function usePersonalInfoStep(
  initialData: AthleteSetupData,
  setFormData: (data: AthleteSetupData) => void,
  onNext: () => void
): PersonalInfoStepState & PersonalInfoStepActions {
  const state = usePersonalInfoState(initialData)
  const actions = usePersonalInfoActions()

  return {
    ...state,
    ...actions,
    isValid: true, // TODO: Implement proper validation
    saveData: () => Promise.resolve()
  }
}