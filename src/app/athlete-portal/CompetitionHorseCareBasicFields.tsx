// CompetitionHorseCareBasicFields.tsx (25 lines) - Single responsibility: Basic care fields
'use client'

import React from 'react'

interface CompetitionHorseCareBasicFieldsProps {
  form: any
}

export function CompetitionHorseCareBasicFields({ form }: CompetitionHorseCareBasicFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Trainer Name</label>
        <input
          type="text"
          value={form.formData.trainer_name}
          onChange={(e) => form.updateField('trainer_name', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Farrier Name</label>
        <input
          type="text"
          value={form.formData.farrier_name}
          onChange={(e) => form.updateField('farrier_name', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  )
}