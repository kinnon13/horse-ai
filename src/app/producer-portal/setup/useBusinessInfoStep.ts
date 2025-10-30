import { ProducerSetupData } from './ProducerSetupTypes'
import { BusinessInfoStepState, BusinessInfoStepActions } from './BusinessInfoTypes'
import { useBusinessInfoState } from './useBusinessInfoState'
import { useBusinessInfoActions } from './useBusinessInfoActions'

export function useBusinessInfoStep(
  initialData: ProducerSetupData,
  setFormData: (data: ProducerSetupData) => void,
  onNext: () => void
): BusinessInfoStepState & BusinessInfoStepActions {
  const state = useBusinessInfoState(initialData)
  const actions = useBusinessInfoActions(
    state.formData,
    setFormData,
    state.errors,
    state.setErrors,
    state.isSaving,
    state.setIsSaving,
    onNext
  )

  return {
    ...state,
    ...actions
  }
}