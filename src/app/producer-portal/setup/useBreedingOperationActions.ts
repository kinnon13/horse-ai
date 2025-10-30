import { ProducerSetupData } from './ProducerSetupTypes'
import { BreedingOperationStepActions } from './BreedingOperationTypes'
import { updateBreedingOperationField } from './BreedingOperationFieldUpdates'
import { validateBreedingOperation } from './BreedingOperationValidationHandler'
import { saveBreedingOperationWithState } from './BreedingOperationSaveHandler'

export function useBreedingOperationActions(
  formData: ProducerSetupData,
  setFormData: (data: ProducerSetupData) => void,
  errors: Record<string, string>,
  setErrors: (errors: Record<string, string>) => void,
  isSaving: boolean,
  setIsSaving: (saving: boolean) => void,
  onNext: () => void,
  onBack: () => void
): BreedingOperationStepActions {
  const validateForm = (): boolean => {
    return validateBreedingOperation(formData, setErrors)
  }

  const updateField = (field: keyof ProducerSetupData, value: any) => {
    updateBreedingOperationField(formData, setFormData, field, value, errors, setErrors)
  }

  const saveData = async (): Promise<void> => {
    await saveBreedingOperationWithState(formData, setIsSaving)
  }

  const goNext = async () => {
    if (validateForm()) {
      await saveData()
      onNext()
    }
  }

  const goBack = () => {
    onBack()
  }

  return {
    updateField,
    goNext,
    goBack,
    validateForm,
    saveData
  }
}