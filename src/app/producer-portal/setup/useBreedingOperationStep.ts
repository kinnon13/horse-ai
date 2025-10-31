import { ProducerSetupData } from './ProducerSetupTypes'
import { BreedingOperationStepState, BreedingOperationStepActions } from './BreedingOperationTypes'
import { useBreedingOperationState } from './useBreedingOperationState'
import { useBreedingOperationActions } from './useBreedingOperationActions'

export function useBreedingOperationStep(
  initialData: ProducerSetupData,
  setFormData: (data: ProducerSetupData) => void,
  onNext: () => void,
  onBack: () => void
): BreedingOperationStepState & BreedingOperationStepActions {
  const state = useBreedingOperationState(initialData)
  const actions = useBreedingOperationActions(
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
    ...actions,
    isValid: actions.validateForm()
  }
}