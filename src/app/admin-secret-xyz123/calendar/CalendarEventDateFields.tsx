import React from 'react'
import { CalendarFormData } from './CalendarTypes'

interface CalendarEventDateFieldsProps {
  formData: CalendarFormData
  setFormData: (data: CalendarFormData) => void
}

export function CalendarEventDateFields({ formData, setFormData }: CalendarEventDateFieldsProps) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700">Start Date *</label>
        <input
          type="datetime-local"
          value={formData.start_date}
          onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">End Date</label>
        <input
          type="datetime-local"
          value={formData.end_date}
          onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
    </>
  )
}

