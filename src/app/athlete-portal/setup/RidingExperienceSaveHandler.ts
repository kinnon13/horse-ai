import { AthleteSetupData } from './AthleteSetupTypes'
import { saveRidingExperienceData } from './RidingExperienceService'

export async function saveRidingExperienceWithState(
  formData: AthleteSetupData,
  setIsSaving: (saving: boolean) => void
): Promise<void> {
  setIsSaving(true)
  try {
    await saveRidingExperienceData(formData)
  } catch (error) {
    console.error('Error saving riding experience:', error)
  } finally {
    setIsSaving(false)
  }
}