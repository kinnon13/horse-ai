import { AthleteSetupData } from './AthleteSetupTypes'
import { saveHorsePartnershipsDataService } from './HorsePartnershipsService'

export async function saveHorsePartnershipsWithState(
  formData: AthleteSetupData,
  setIsSaving: (saving: boolean) => void
): Promise<void> {
  setIsSaving(true)
  try {
    await saveHorsePartnershipsDataService(formData)
  } catch (error) {
    console.error('Error saving horse partnerships:', error)
  } finally {
    setIsSaving(false)
  }
}




