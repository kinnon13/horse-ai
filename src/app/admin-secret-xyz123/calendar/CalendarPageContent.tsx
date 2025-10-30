'use client'

import React, { useState } from 'react'
import { useCalendar } from '@/hooks/useCalendar'
import { useAuth } from '@/components/AuthProvider'
import { CalendarEventForm } from './CalendarEventForm'
import { CalendarEventList } from './CalendarEventList'
import { CalendarStats } from './CalendarStats'
import { CalendarHeader } from './CalendarHeader'
import { CalendarLoadingState } from './CalendarLoadingState'
import { CalendarErrorState } from './CalendarErrorState'
import { useCalendarHandlers } from './useCalendarHandlers'

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
        {showAddForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Event</h2>
            <CalendarEventForm onSubmit={handleCreateEvent} onCancel={() => setShowAddForm(false)} />
          </div>
        )}
        {editingEvent && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Edit Event</h2>
            <CalendarEventForm onSubmit={(data) => handleUpdateEvent(editingEvent.id, data)} onCancel={() => setEditingEvent(null)} initialData={editingEvent} />
          </div>
        )}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">All Events ({events.length})</h2>
          </div>
          <CalendarEventList events={events} loading={loading} error={error} onEdit={setEditingEvent} onDelete={handleDeleteEvent} />
        </div>
        <CalendarStats events={events} />
      </div>
    </div>
  )
}
