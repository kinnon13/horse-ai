'use client'

import React from 'react'

interface CompetitionHorseCareInfoProps {
  form: any
}

export default function CompetitionHorseCareInfo({ form }: CompetitionHorseCareInfoProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Care Information</h3>
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
    </div>
  )
}



