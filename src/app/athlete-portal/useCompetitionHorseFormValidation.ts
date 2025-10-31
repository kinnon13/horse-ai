// useCompetitionHorseFormValidation.ts (20 lines) - Form validation logic
'use client'

import { useCallback } from 'react'
import { CompetitionHorseFormData } from './CompetitionHorseFormTypes'
import { CompetitionHorseFormValidation } from './CompetitionHorseFormValidation'

export function useCompetitionHorseFormValidation(
  formData: CompetitionHorseFormData,
  setErrors: (errors: Record<string, string>) => void
) {
  const setError = useCallback((field: string, error: string) => {
    setErrors({ [field]: error })
  }, [setErrors])

  const clearErrors = useCallback(() => {
    setErrors({})
  }, [setErrors])

  const validateForm = useCallback((): boolean => {
    return CompetitionHorseFormValidation.validateForm(formData, setError, clearErrors)
  }, [formData, setError, clearErrors])

  return {
    setError,
    clearErrors,
    validateForm
  }
}
