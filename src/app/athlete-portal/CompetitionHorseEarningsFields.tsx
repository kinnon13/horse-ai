'use client'

import React from 'react'

interface CompetitionHorseEarningsFieldsProps {
  form: any
}

export function CompetitionHorseEarningsFields({ form }: CompetitionHorseEarningsFieldsProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Performance Earnings</label>
      <input
        type="number"
        value={form.formData.performance_earnings}
        onChange={(e) => form.updateField('performance_earnings', e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        min="0"
      />
    </div>
  )
}