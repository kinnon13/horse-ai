'use client'

import React from 'react'

interface CompetitionHorseHighlightsFieldsProps {
  form: any
}

export function CompetitionHorseHighlightsFields({ form }: CompetitionHorseHighlightsFieldsProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Performance Highlights</label>
      <textarea
        value={form.formData.performance_highlights}
        onChange={(e) => form.updateField('performance_highlights', e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={3}
      />
    </div>
  )
}