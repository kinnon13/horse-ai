import { ProducerSetupData } from './ProducerSetupTypes'

export function validateBusinessInfoForm(formData: ProducerSetupData): Record<string, string> {
  const errors: Record<string, string> = {}
  
  if (!formData.business_name?.trim()) {
    errors.business_name = 'Business name is required'
  }
  if (!formData.contact_name?.trim()) {
    errors.contact_name = 'Contact name is required'
  }
  if (!formData.email?.trim()) {
    errors.email = 'Email is required'
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = 'Email is invalid'
  }

  return errors
}

