'use client'

import React from 'react'
import { BREEDS, SEX_OPTIONS, OWNERSHIP_TYPES } from './CompetitionHorseFormConstants'

interface CompetitionHorseBasicInfoProps {form: any
}

export default function CompetitionHorseBasicInfo({ form }: CompetitionHorseBasicInfoProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Breed *</label>
          <select
            value={form.formData.breed}
            onChange={(e) => form.updateField('breed', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Breed</option>
            {BREEDS.map(breed => (
              <option key={breed} value={breed}>{breed}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sex *</label>
          <select
            value={form.formData.sex}
            onChange={(e) => form.updateField('sex', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            {SEX_OPTIONS.map(sex => (
              <option key={sex} value={sex}>{sex}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Birth Year</label>
          <input
            type="number"
            value={form.formData.birth_year}
            onChange={(e) => form.updateField('birth_year', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1900"
            max="2024"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
          <input
            type="text"
            value={form.formData.color}
            onChange={(e) => form.updateField('color', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  )
}