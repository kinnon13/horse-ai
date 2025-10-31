// Modal.tsx (35 lines) - Single responsibility: Main modal component
'use client'

import React from 'react'
import { CompetitionHorseFormModalProps } from './CompetitionHorseFormTypes'
import { useCompetitionHorseForm } from './useCompetitionHorseForm'
import { CompetitionHorseFormHeader } from './CompetitionHorseFormHeader'
import { CompetitionHorseFormContent } from './CompetitionHorseFormContent'
import { ModalHelpers } from './ModalHelpers'

export default function Modal({ horse, onSave, onClose }: CompetitionHorseFormModalProps) {
  const form = useCompetitionHorseForm(horse)

  const handleSubmit = (e: React.FormEvent) => {
    ModalHelpers.handleFormSubmit(e, onSave, form.formData, horse)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CompetitionHorseFormHeader horse={horse} onClose={onClose} />
        <CompetitionHorseFormContent form={form} onSubmit={handleSubmit} onClose={onClose} horse={horse} />
      </div>
    </div>
  )
}

