// Timers: clearInterval cleanup
import { AthleteSetupData } from './AthleteSetupTypes'

export async function savePersonalInfoData(formData: AthleteSetupData): Promise<void> {
  try {
    // TODO: Call API to save personal info data

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Log analytics event

  } catch (error) {
    console.error('Error saving personal info:', error)
    throw error
  }
}




