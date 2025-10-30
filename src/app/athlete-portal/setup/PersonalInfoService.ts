import { AthleteSetupData } from './AthleteSetupTypes'

export async function savePersonalInfoData(formData: AthleteSetupData): Promise<void> {
  try {
    // TODO: Call API to save personal info data
    console.log('Saving personal info:', formData)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Log analytics event
    console.log('ATHLETE_SETUP_PERSONAL', {
      step: 'personal_info',
      rider_name: formData.rider_name,
      email: formData.email,
      phone: formData.phone,
      age: formData.age,
      location_city: formData.location_city,
      location_state: formData.location_state,
      location_country: formData.location_country
    })
  } catch (error) {
    console.error('Error saving personal info:', error)
    throw error
  }
}



