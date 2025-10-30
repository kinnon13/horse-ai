'use client'

import React from 'react'
import { DISCIPLINES, COMPETITION_STATUSES } from './CompetitionHorseFormConstants'

interface CompetitionHorsePerformanceInfoProps {form: any
}

export default function CompetitionHorsePerformanceInfo({ form }: CompetitionHorsePerformanceInfoProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Performance Information</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Primary Discipline</label>
          <select
            value={form.formData.primary_discipline}
            onChange={(e) => form.updateField('primary_discipline', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Primary Discipline</option>
            {DISCIPLINES.map(discipline => (
              <option key={discipline} value={discipline}>{discipline}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Performance Disciplines</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {DISCIPLINES.map(discipline => (
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Competition Status</label>
          <select
            value={form.formData.competition_status}
            onChange={(e) => form.updateField('competition_status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {COMPETITION_STATUSES.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Performance Highlights</label>
          <textarea
            value={form.formData.performance_highlights}
            onChange={(e) => form.updateField('performance_highlights', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>
      </div>
    </div>
  )
}

