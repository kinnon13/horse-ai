import React from 'react'
import { CalendarFormData } from './CalendarTypes'
import { CalendarEventTitleField } from './CalendarEventTitleField'
import { CalendarEventTypeField } from './CalendarEventTypeField'
import { CalendarEventDateFields } from './CalendarEventDateFields'

interface CalendarEventBasicFieldsProps {
  formData: CalendarFormData
  setFormData: (data: CalendarFormData) => void
}

export function CalendarEventBasicFields({ formData, setFormData }: CalendarEventBasicFieldsProps) {
  return (
    <>
      <CalendarEventTitleField formData={formData} setFormData={setFormData} />
      <CalendarEventTypeField formData={formData} setFormData={setFormData} />
      <CalendarEventDateFields formData={formData} setFormData={setFormData} />
    </>
  )
}
