import { AthleteSetupData } from './AthleteSetupTypes'
import { saveHorsePartnershipsData } from './HorsePartnershipsService'

export async function saveHorsePartnershipsWithState(
  formData: AthleteSetupData,
  setIsSaving: (saving: boolean) => void
): Promise<void> {
  setIsSaving(true)
  try {
    await saveHorsePartnershipsData(formData)
  } catch (error) {
    console.error('Error saving horse partnerships:', error)
  } finally {
    setIsSaving(false)
  }
}



