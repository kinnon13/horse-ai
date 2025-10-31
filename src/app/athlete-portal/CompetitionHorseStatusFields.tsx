'use client'

import React from 'react'

interface CompetitionHorseStatusFieldsProps {
  form: any
}

export function CompetitionHorseStatusFields({ form }: CompetitionHorseStatusFieldsProps) {
  const { COMPETITION_STATUSES } = require('./CompetitionHorseFormConstants')
  
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Competition Status</label>
      <select
        value={form.formData.competition_status}
        onChange={(e) => form.updateField('competition_status', e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {COMPETITION_STATUSES.map((status: string) => (
          <option key={status} value={status}>{status}</option>
        ))}
      </select>
    </div>
  )
}