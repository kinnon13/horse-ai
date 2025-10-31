'use client'

import React from 'react'

interface CompetitionHorseNameFieldsProps {
  form: any
}

export function CompetitionHorseNameFields({ form }: CompetitionHorseNameFieldsProps) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Horse Name *</label>
        <input
          type="text"
          value={form.formData.horse_name}
          onChange={(e) => form.updateField('horse_name', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Registered Name</label>
        <input
          type="text"
          value={form.formData.registered_name}
          onChange={(e) => form.updateField('registered_name', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </>
  )
}