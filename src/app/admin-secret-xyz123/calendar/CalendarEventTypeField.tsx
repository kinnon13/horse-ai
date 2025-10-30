import React from 'react'
import { CalendarFormData } from './CalendarTypes'

interface CalendarEventTypeFieldProps {
  formData: CalendarFormData
  setFormData: (data: CalendarFormData) => void
}

export function CalendarEventTypeField({ formData, setFormData }: CalendarEventTypeFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Event Type *</label>
      <select
        value={formData.event_type}
        onChange={(e) => setFormData({ ...formData, event_type: e.target.value as any })}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        required
      >
        <option value="show">Show/Competition</option>
        <option value="deadline">Deadline</option>
        <option value="breeding">Breeding</option>
        <option value="other">Other</option>
      </select>
    </div>
  )
}

