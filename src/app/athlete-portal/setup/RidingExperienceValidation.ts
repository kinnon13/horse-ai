import { AthleteSetupData } from './AthleteSetupTypes'

export function validateRidingExperienceForm(formData: AthleteSetupData): Record<string, string> {
  const errors: Record<string, string> = {}
  
  if (formData.years_riding && formData.years_riding < 0) {
    errors.years_riding = 'Years riding must be 0 or greater'
  }
  if (formData.primary_disciplines.length === 0) {
    errors.primary_disciplines = 'Please select at least one discipline'
  }
  if (!formData.skill_level) {
    errors.skill_level = 'Please select a skill level'
  }
  if (formData.travel_radius_miles && formData.travel_radius_miles < 0) {
    errors.travel_radius_miles = 'Travel radius must be 0 or greater'
  }

  return errors
}



