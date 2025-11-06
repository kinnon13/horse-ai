// TODO: Add try-catch - wrap async operations for production
// Database: transaction handling
import { AthleteSetupData } from './AthleteSetupTypes'
import { RidingExperienceStepActions } from './RidingExperienceTypes'
import { updateRidingExperienceField } from './RidingExperienceFieldUpdates'
import { validateRidingExperience } from './RidingExperienceValidationHandler'
import { saveRidingExperienceWithState } from './RidingExperienceSaveHandler'

export function useRidingExperienceActions(
  formData: AthleteSetupData,
  setFormData: (data: AthleteSetupData) => void,
  errors: Record<string, string>,
  setErrors: (errors: Record<string, string>) => void,
  isSaving: boolean,
  setIsSaving: (saving: boolean) => void,
  onNext: () => void,
  onBack: () => void
): RidingExperienceStepActions {
  const validateForm = (): boolean => {
    return validateRidingExperience(formData, setErrors)
  }

  const updateField = (field: string, value: any) => {
    updateRidingExperienceField(formData, setFormData, field as keyof AthleteSetupData, value, errors, setErrors)
  }

  const saveData = async (): Promise<void> => {
    await saveRidingExperienceWithState(formData, setIsSaving)
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
    goBack
  }
}