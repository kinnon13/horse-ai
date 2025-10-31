// useCompetitionHorseFormState.ts (30 lines) - Form state management
'use client'

import { useState, useCallback } from 'react'
import { CompetitionHorse } from './AthleteHorseTypes'
import { CompetitionHorseFormData } from './CompetitionHorseFormTypes'

export function useCompetitionHorseFormState(horse?: CompetitionHorse) {
  const [formData, setFormDataState] = useState<CompetitionHorseFormData>({
    name: horse?.horse_name || '',
    breed: horse?.breed || '',
    age: horse?.birth_year?.toString() || '',
    gender: horse?.sex || '',
    color: horse?.color || '',
    height: '',
    weight: '',
    registration_number: horse?.registration_number || '',
    owner_name: horse?.owner_name || '',
    owner_phone: horse?.owner_phone || '',
    owner_email: horse?.owner_email || '',
    trainer_name: '',
    trainer_phone: '',
    trainer_email: '',
    notes: horse?.notes || '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const setFormData = useCallback((data: Partial<CompetitionHorseFormData>) => {
    setFormDataState(prev => ({ ...prev, ...data }))
  }, [])

  return {
    formData,
    errors,
    isSubmitting,
    setFormData,
    setErrors,
    setIsSubmitting
  }
}
