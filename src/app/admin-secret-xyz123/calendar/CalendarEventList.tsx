import React from 'react'
import { CalendarEvent } from '@/hooks/CalendarTypes'
import { CalendarEventCard } from './CalendarEventCard'
import { CalendarEventListLoading, CalendarEventListError, CalendarEventListEmpty } from './CalendarEventListStates'

interface CalendarEventListProps {
  events: CalendarEvent[]
  loading: boolean
  error: string | null
  onEdit: (event: CalendarEvent) => void
  onDelete: (eventId: string) => void
}

export function CalendarEventList({ events, loading, error, onEdit, onDelete }: CalendarEventListProps) {
  if (loading) return <CalendarEventListLoading />
  if (error) return <CalendarEventListError error={error} />
  if (events.length === 0) return <CalendarEventListEmpty />

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
