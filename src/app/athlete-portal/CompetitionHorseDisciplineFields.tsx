'use client'

import React from 'react'

interface CompetitionHorseDisciplineFieldsProps {
  form: any
}

export function CompetitionHorseDisciplineFields({ form }: CompetitionHorseDisciplineFieldsProps) {
  const { DISCIPLINES } = require('./CompetitionHorseFormConstants')
  
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Primary Discipline</label>
        <select
          value={form.formData.primary_discipline}
          onChange={(e) => form.updateField('primary_discipline', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Primary Discipline</option>
          {DISCIPLINES.map((discipline: string) => (
            <option key={discipline} value={discipline}>{discipline}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Performance Disciplines</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {DISCIPLINES.map((discipline: string) => (
            <label key={discipline} className="flex items-center">
              <input
                type="checkbox"
                checked={form.formData.performance_disciplines.includes(discipline)}
                onChange={() => form.handleDisciplineToggle(discipline)}
                className="mr-2"
              />
              <span className="text-sm">{discipline}</span>
            </label>
          ))}
        </div>
      </div>
    </>
  )
}