// CompetitionHorseFormContent.tsx (30 lines) - Single responsibility: Form content
'use client'

import React from 'react'
import { CompetitionHorse } from './AthleteHorseTypes'
import { CompetitionHorseFormState } from './CompetitionHorseFormTypes'
import { CompetitionHorseFormFields } from './CompetitionHorseFormFields'
import { CompetitionHorseFormActions } from './CompetitionHorseFormActions'

interface CompetitionHorseFormContentProps {
  form: CompetitionHorseFormState
  onSubmit: (e: React.FormEvent) => void
  onClose: () => void
  horse?: CompetitionHorse
}

export function CompetitionHorseFormContent({ form, onSubmit, onClose, horse }: CompetitionHorseFormContentProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <CompetitionHorseFormFields form={form} />
      <CompetitionHorseFormActions form={form} onClose={onClose} horse={horse} />
    </form>
  )
}