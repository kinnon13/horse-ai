import { useState } from 'react'
import { ProducerSetupData } from './ProducerSetupTypes'
import { BreedingOperationStepState } from './BreedingOperationTypes'

export function useBreedingOperationState(initialData: ProducerSetupData) {
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  return {
    formData: initialData,
    isSaving,
    errors,
    setIsSaving,
    setErrors
  }
}




