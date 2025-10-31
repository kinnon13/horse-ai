import React, { useState } from 'react'
import { CalendarFormData } from './CalendarTypes'
import { CalendarEventBasicFields } from './CalendarEventBasicFields'
import { CalendarEventAdditionalFields } from './CalendarEventAdditionalFields'
import { CalendarEventFormButtons } from './CalendarEventFormButtons'

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

      <CalendarEventFormButtons onCancel={onCancel} />
    </form>
  )
}
