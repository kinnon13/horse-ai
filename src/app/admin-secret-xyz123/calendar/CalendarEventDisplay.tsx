// CalendarEventDisplay.tsx (25 lines) - Single responsibility: Event display
import React from 'react'
import { CalendarEvent } from '@/hooks/CalendarTypes'
import { formatEventDate, formatEventTime } from './CalendarConstants'

interface CalendarEventDisplayProps {
  event: CalendarEvent
}

export function CalendarEventDisplay({ event }: CalendarEventDisplayProps) {
  return (
    <div className="flex-1">
      <h3 className="text-lg font-semibold text-gray-900">{event.event_title}</h3>
      <div className="mt-1 flex items-center space-x-4 text-sm text-gray-600">
        <span>{formatEventDate(event.event_date)}</span>
        <span>{formatEventTime(event.event_date)}</span>
        {event.event_date && (
          <span>to {formatEventTime(event.event_date)}</span>
        )}
      </div>
      {event.location_city && (
        <p className="mt-1 text-sm text-gray-600">📍 {event.location_city}{event.location_state && `, ${event.location_state}`}</p>
      )}
      {event.notes && (
        <p className="mt-2 text-sm text-gray-700">{event.notes}</p>
      )}
    </div>
  )
}
