import { ProducerSetupData } from './ProducerSetupTypes'

export function validateBreedingOperationForm(formData: ProducerSetupData): Record<string, string> {
  const errors: Record<string, string> = {}
  
  if (formData.total_mares < 0) {
    errors.total_mares = 'Total mares must be 0 or greater'
  }
  if (formData.total_stallions < 0) {
    errors.total_stallions = 'Total stallions must be 0 or greater'
  }
  if (formData.annual_foals < 0) {
    errors.annual_foals = 'Annual foals must be 0 or greater'
  }
  if (formData.specialties.length === 0) {
    errors.specialties = 'Please select at least one specialty'
  }

  return errors
}




