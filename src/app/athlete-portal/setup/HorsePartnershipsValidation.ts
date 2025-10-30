import { AthleteSetupData } from './AthleteSetupTypes'

export function validateHorsePartnershipsForm(formData: AthleteSetupData): Record<string, string> {
  const errors: Record<string, string> = {}
  
  if (formData.owns_horses < 0) {
    errors.owns_horses = 'Number of owned horses cannot be negative'
  }
  if (formData.leases_horses < 0) {
    errors.leases_horses = 'Number of leased horses cannot be negative'
  }
  if (formData.owns_horses === 0 && formData.leases_horses === 0 && !formData.rides_for_others) {
    errors.partnerships = 'Please indicate at least one type of horse relationship'
  }

  return errors
}

