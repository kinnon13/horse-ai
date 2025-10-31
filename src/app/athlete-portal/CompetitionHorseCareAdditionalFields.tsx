// CompetitionHorseCareAdditionalFields.tsx (25 lines) - Single responsibility: Additional care fields
'use client'

import React from 'react'

interface CompetitionHorseCareAdditionalFieldsProps {
  form: any
}

export function CompetitionHorseCareAdditionalFields({ form }: CompetitionHorseCareAdditionalFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Vet Name</label>
        <input
          type="text"
          value={form.formData.vet_name}
          onChange={(e) => form.updateField('vet_name', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Feed Program</label>
        <textarea
          value={form.formData.feed_program}
          onChange={(e) => form.updateField('feed_program', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </div>
    </div>
  )
}