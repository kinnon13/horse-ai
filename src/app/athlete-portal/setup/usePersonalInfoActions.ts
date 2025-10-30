import { AthleteSetupData } from './AthleteSetupTypes'
import { PersonalInfoStepActions } from './PersonalInfoTypes'
import { savePersonalInfoData } from './PersonalInfoService'
import { validatePersonalInfo } from './PersonalInfoValidationHandler'
import { logEvent, CRITICAL_EVENTS } from '@/lib/logEvent'

export function usePersonalInfoActions(
  formData: AthleteSetupData,
  setFormData: (data: AthleteSetupData) => void,
  errors: Record<string, string>,
  setErrors: (errors: Record<string, string>) => void,
  isSaving: boolean,
  setIsSaving: (saving: boolean) => void,
  onNext: () => void
): PersonalInfoStepActions {
  const validateForm = (): boolean => {
    return validatePersonalInfo(formData, setErrors)
  }

  const updateField = (field: keyof AthleteSetupData, value: any) => {
    setFormData({ ...formData, [field]: value })
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' })
    }
  }

  const saveData = async (): Promise<void> => {
    setIsSaving(true)
    try {
      await savePersonalInfoData(formData)
      await logEvent(CRITICAL_EVENTS.PERSONAL_INFO_SUBMITTED, {
        userId: formData.user_id,
        step: 'personal_info'
      })
    } catch (error) {
      console.error('Error saving personal info:', error)
      await logEvent(CRITICAL_EVENTS.PARTIAL_FAILURE, {
        userId: formData.user_id,
        step: 'personal_info',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
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