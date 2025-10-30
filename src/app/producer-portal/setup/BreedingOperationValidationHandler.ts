import { ProducerSetupData } from './ProducerSetupTypes'
import { validateBreedingOperationForm } from './BreedingOperationValidation'

export function validateBreedingOperation(
  formData: ProducerSetupData,
  setErrors: (errors: Record<string, string>) => void
): boolean {
  const newErrors = validateBreedingOperationForm(formData)
  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}



