import { AthleteSetupData } from './AthleteSetupTypes'

export function validatePersonalInfoForm(formData: AthleteSetupData): Record<string, string> {
  const errors: Record<string, string> = {}
  
  if (!formData.rider_name?.trim()) {
    errors.rider_name = 'Rider name is required'
  }
  if (!formData.email?.trim()) {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Please enter a valid email address'
  }
  if (formData.age && (formData.age < 13 || formData.age > 100)) {
    errors.age = 'Age must be between 13 and 100'
  }
  if (formData.phone && !/^\(\d{3}\) \d{3}-\d{4}$/.test(formData.phone)) {
    errors.phone = 'Please enter a valid phone number'
  }

  return errors
}

