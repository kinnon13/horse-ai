import { AthleteSetupData } from './AthleteSetupTypes'
import { HorsePartnershipsStepActions } from './HorsePartnershipsTypes'
import { validateHorsePartnerships } from './HorsePartnershipsValidationHandler'
import { saveHorsePartnershipsWithState } from './HorsePartnershipsSaveHandler'
import { logEvent, CRITICAL_EVENTS } from '@/lib/logEvent'

export function useHorsePartnershipsActions(
  formData: AthleteSetupData,
  setFormData: (data: AthleteSetupData) => void,
  errors: Record<string, string>,
  setErrors: (errors: Record<string, string>) => void,
  isSaving: boolean,
  setIsSaving: (saving: boolean) => void,
  onNext: () => void,
  onBack: () => void
): HorsePartnershipsStepActions {
  const validateForm = (): boolean => {
    return validateHorsePartnerships(formData, setErrors)
  }

  const updateField = (field: keyof AthleteSetupData, value: any) => {
    setFormData({ ...formData, [field]: value })
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' })
    }
  }

  const saveData = async (): Promise<void> => {
    try {
      await saveHorsePartnershipsWithState(formData, setIsSaving)
      await logEvent(CRITICAL_EVENTS.HORSE_PARTNERSHIPS_SUBMITTED, {userId: formData.user_id,
        step: 'horse_partnerships',
        horseCount: formData.horses?.length || 0
      })
    } catch (error) {
      console.error('Error saving horse partnerships:', error)
      await logEvent(CRITICAL_EVENTS.PARTIAL_FAILURE, {userId: formData.user_id,
        step: 'horse_partnerships',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
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