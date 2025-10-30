import React, { useState } from 'react'
import { CalendarFormData } from './CalendarTypes'
import { CalendarEventBasicFields } from './CalendarEventBasicFields'
import { CalendarEventAdditionalFields } from './CalendarEventAdditionalFields'

interface CalendarEventFormProps {
  onSubmit: (data: CalendarFormData) => void
  onCancel: () => void
  initialData?: Partial<CalendarFormData>
}

export function CalendarEventForm({ onSubmit, onCancel, initialData }: CalendarEventFormProps) {
  const [formData, setFormData] = useState<CalendarFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    start_date: initialData?.start_date || '',
    end_date: initialData?.end_date || '',
    event_type: initialData?.event_type || 'other',
    location: initialData?.location || ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CalendarEventBasicFields formData={formData} setFormData={setFormData} />
      </div>
      
      <CalendarEventAdditionalFields formData={formData} setFormData={setFormData} />

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
        >
          Save Event
        </button>
      </div>
    </form>
  )
}
