import React from 'react'
import { CalendarFormData } from './CalendarTypes'

interface CalendarEventAdditionalFieldsProps {
  formData: CalendarFormData
  setFormData: (data: CalendarFormData) => void
}

export function CalendarEventAdditionalFields({ formData, setFormData }: CalendarEventAdditionalFieldsProps) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700">Location</label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
    </>
  )
}

