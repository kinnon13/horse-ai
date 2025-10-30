import React from 'react'
import { CalendarEvent } from '@/hooks/CalendarTypes'
import { CalendarEventCard } from './CalendarEventCard'

interface CalendarEventListProps {
  events: CalendarEvent[]
  loading: boolean
  error: string | null
  onEdit: (event: CalendarEvent) => void
  onDelete: (eventId: string) => void
}

export function CalendarEventList({ events, loading, error, onEdit, onDelete }: CalendarEventListProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500">Loading events...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="text-red-800">Error loading events: {error}</div>
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">No events found</div>
        <div className="text-sm text-gray-400 mt-1">Create your first event to get started</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {events.map(event => (
        <CalendarEventCard
          key={event.id}
          event={event}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
