// CalendarEventForms.tsx (20 lines) - Event form containers
'use client'

import React from 'react'
import { CalendarEventForm } from './CalendarEventForm'

interface CalendarEventFormsProps {
  showAddForm: boolean
  editingEvent: any
  onAddSubmit: (data: unknown) => void
  onEditSubmit: (data: unknown) => void
  onAddCancel: () => void
  onEditCancel: () => void
}

export function CalendarEventForms({ 
  showAddForm, 
  editingEvent, 
  onAddSubmit, 
  onEditSubmit, 
  onAddCancel, 
  onEditCancel 
}: CalendarEventFormsProps) {
  return (
    <>
      {showAddForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Event</h2>
          <CalendarEventForm onSubmit={onAddSubmit} onCancel={onAddCancel} />
        </div>
      )}
      {editingEvent && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Edit Event</h2>
          <CalendarEventForm onSubmit={onEditSubmit} onCancel={onEditCancel} initialData={editingEvent} />
        </div>
      )}
    </>
  )
}