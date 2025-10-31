'use client'

import React, { useState } from 'react'
import { useCalendar } from '@/hooks/useCalendar'
import { useAuth } from '@/components/AuthProvider'
import { CalendarEventList } from './CalendarEventList'
import { CalendarStats } from './CalendarStats'
import { CalendarHeader } from './CalendarHeader'
import { CalendarLoadingState } from './CalendarLoadingState'
import { CalendarErrorState } from './CalendarErrorState'
import { useCalendarHandlers } from './useCalendarHandlers'
import { CalendarEventForms } from './CalendarEventForms'

export function CalendarPageContent() {
  const { user } = useAuth()
  const { events, loading, error, createEvent, updateEvent, deleteEvent } = useCalendar()
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<any>(null)
  const { handleCreateEvent, handleUpdateEvent, handleDeleteEvent } = useCalendarHandlers(
    user, createEvent, updateEvent, deleteEvent, setShowAddForm, setEditingEvent
  )

  if (loading) return <CalendarLoadingState />
  if (error) return <CalendarErrorState error={error} />

  return (
    <div className="min-h-screen bg-gray-50">
      <CalendarHeader onAddEvent={() => setShowAddForm(true)} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CalendarEventForms 
          showAddForm={showAddForm}
          editingEvent={editingEvent}
          onAddSubmit={handleCreateEvent}
          onEditSubmit={(data: any) => handleUpdateEvent(editingEvent.id, data)}
          onAddCancel={() => setShowAddForm(false)}
          onEditCancel={() => setEditingEvent(null)}
        />
        <CalendarEventList events={events} loading={loading} error={error} onEdit={setEditingEvent} onDelete={handleDeleteEvent} />
        <CalendarStats events={events} />
      </div>
    </div>
  )
}
