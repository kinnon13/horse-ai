import { ProducerSetupData } from './ProducerSetupTypes'
import { BusinessInfoStepActions } from './BusinessInfoTypes'
import { validateBusinessInfoForm } from './BusinessInfoValidation'
import { saveBusinessInfoData } from './BusinessInfoService'

export function useBusinessInfoActions(
  formData: ProducerSetupData,
  setFormData: (data: ProducerSetupData) => void,
  errors: Record<string, string>,
  setErrors: (errors: Record<string, string>) => void,
  isSaving: boolean,
  setIsSaving: (saving: boolean) => void,
  onNext: () => void
): BusinessInfoStepActions {
  const validateForm = (): boolean => {
    const newErrors = validateBusinessInfoForm(formData)
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const updateField = (field: keyof ProducerSetupData, value: any) => {
    setFormData({ ...formData, [field]: value })
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' })
    }
  }

  const saveData = async (): Promise<void> => {
    setIsSaving(true)
    try {
      await saveBusinessInfoData(formData)
    } catch (error) {
      console.error('Error saving business info:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const goNext = async () => {
    if (validateForm()) {
      await saveData()
      onNext()
    }
  }

  return {
    updateField,
    goNext,
    validateForm,
    saveData
  }
}

