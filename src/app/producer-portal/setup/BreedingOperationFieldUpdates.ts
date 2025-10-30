import { ProducerSetupData } from './ProducerSetupTypes'

export function updateBreedingOperationField(
  formData: ProducerSetupData,
  setFormData: (data: ProducerSetupData) => void,
  field: keyof ProducerSetupData,
  value: any,
  errors: Record<string, string>,
  setErrors: (errors: Record<string, string>) => void
) {
  setFormData({ ...formData, [field]: value })
  // Clear error when user starts typing
  if (errors[field]) {
    setErrors({ ...errors, [field]: '' })
  }
}

