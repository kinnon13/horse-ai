import { AthleteSetupData } from './AthleteSetupTypes'

export async function saveRidingExperienceData(formData: AthleteSetupData): Promise<void> {
  try {
    // TODO: Call API to save riding experience data
    console.log('Saving riding experience:', formData)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Log analytics event
    console.log('ATHLETE_SETUP', {
      step: 'riding_experience',
      years_riding: formData.years_riding,
      disciplines: formData.primary_disciplines,
      skill_level: formData.skill_level,
      competition_level: formData.competition_level,
      travel_radius: formData.travel_radius_miles
    })
  } catch (error) {
    console.error('Error saving riding experience:', error)
    throw error
  }
}