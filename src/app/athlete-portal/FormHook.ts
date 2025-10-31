// FormHook.ts (35 lines) - Single responsibility: Main form hook logic
import { useState, useCallback } from 'react'
import { CompetitionHorse } from './AthleteHorseTypes'
import { CompetitionHorseFormData, CompetitionHorseFormState } from './CompetitionHorseFormTypes'
import { FormHelpers } from './FormHelpers'

export function useFormHook(horse?: CompetitionHorse): CompetitionHorseFormState {
  const [formData, setFormDataState] = useState<CompetitionHorseFormData>(
    FormHelpers.initializeFormData(horse)
  )

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const setFormData = useCallback((data: Partial<CompetitionHorseFormData>) => {
    setFormDataState(prev => ({ ...prev, ...data }))
  }, [])

  const setError = useCallback((field: string, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }))
  }, [])

  const clearErrors = useCallback(() => {
    setErrors({})
  }, [])

  const validateForm = useCallback((): boolean => {
    clearErrors()
    const validationErrors = FormHelpers.validateFormData(formData)
    Object.entries(validationErrors).forEach(([field, error]) => {
      setError(field, error)
    })
    return Object.keys(validationErrors).length === 0
  }, [formData, setError, clearErrors])

  return {
    formData,
    errors,
    isSubmitting,
    setFormData,
    setError,
    clearErrors,
    validateForm,
  }
}

