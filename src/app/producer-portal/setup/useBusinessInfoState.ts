import { useState } from 'react'
import { ProducerSetupData } from './ProducerSetupTypes'
import { BusinessInfoStepState } from './BusinessInfoTypes'

export function useBusinessInfoState(initialData: ProducerSetupData) {
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

