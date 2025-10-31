import React from 'react'
import { CalendarFormData } from './CalendarTypes'

interface CalendarEventTitleFieldProps {
  formData: CalendarFormData
  setFormData: (data: CalendarFormData) => void
}

export function CalendarEventTitleField({ formData, setFormData }: CalendarEventTitleFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Title *</label>
      <input
        type="text"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        required
      />
    </div>
  )
}




