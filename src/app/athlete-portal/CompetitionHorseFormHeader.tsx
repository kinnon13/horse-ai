// CompetitionHorseFormHeader.tsx (30 lines) - Single responsibility: Modal header
'use client'

import React from 'react'
import { CompetitionHorse } from './AthleteHorseTypes'

interface CompetitionHorseFormHeaderProps {
  horse?: CompetitionHorse
  onClose: () => void
}

export function CompetitionHorseFormHeader({ horse, onClose }: CompetitionHorseFormHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-gray-900">
        {horse ? 'Edit Horse' : 'Add New Horse'}
      </h2>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Close modal"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}