'use client'

import React from 'react'

interface CompetitionHorseBreedFieldsProps {
  form: any
}

export function CompetitionHorseBreedFields({ form }: CompetitionHorseBreedFieldsProps) {
  const { BREEDS, SEX_OPTIONS } = require('./CompetitionHorseFormConstants')
  
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Breed *</label>
        <select
          value={form.formData.breed}
          onChange={(e) => form.updateField('breed', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select Breed</option>
          {BREEDS.map((breed: string) => (
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
          {SEX_OPTIONS.map((sex: string) => (
            <option key={sex} value={sex}>{sex}</option>
          ))}
        </select>
      </div>
    </>
  )
}