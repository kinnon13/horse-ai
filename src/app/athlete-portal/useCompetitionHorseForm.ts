// useCompetitionHorseForm.ts (25 lines) - Main form hook coordinator
'use client'

import { CompetitionHorse } from './AthleteHorseTypes'
import { CompetitionHorseFormState } from './CompetitionHorseFormTypes'
import { useCompetitionHorseFormState } from './useCompetitionHorseFormState'
import { useCompetitionHorseFormValidation } from './useCompetitionHorseFormValidation'

export function useCompetitionHorseForm(horse?: CompetitionHorse): CompetitionHorseFormState {
  const { formData, errors, isSubmitting, setFormData, setErrors, setIsSubmitting } = useCompetitionHorseFormState(horse)
  const { setError, clearErrors, validateForm } = useCompetitionHorseFormValidation(formData, setErrors)

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