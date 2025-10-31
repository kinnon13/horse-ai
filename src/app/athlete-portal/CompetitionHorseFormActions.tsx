// CompetitionHorseFormActions.tsx (30 lines) - Single responsibility: Form actions
'use client'

import React from 'react'
import { CompetitionHorse } from './AthleteHorseTypes'
import { CompetitionHorseFormState } from './CompetitionHorseFormTypes'

interface CompetitionHorseFormActionsProps {
  form: CompetitionHorseFormState
  onClose: () => void
  horse?: CompetitionHorse
}

export function CompetitionHorseFormActions({ form, onClose, horse }: CompetitionHorseFormActionsProps) {
  return (
    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={form.isSubmitting}
        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {form.isSubmitting ? 'Saving...' : horse ? 'Update Horse' : 'Add Horse'}
      </button>
    </div>
  )
}