// CalendarEventActions.tsx (25 lines) - Single responsibility: Event actions
import React from 'react'
import { CalendarEvent } from '@/hooks/CalendarTypes'
import { EVENT_TYPE_COLORS } from './CalendarConstants'

interface CalendarEventActionsProps {
  event: CalendarEvent
  onEdit: (event: CalendarEvent) => void
  onDelete: (eventId: string) => void
}

export function CalendarEventActions({ event, onEdit, onDelete }: CalendarEventActionsProps) {
  return (
    <div className="flex items-center space-x-2">
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${EVENT_TYPE_COLORS[event.event_type]}`}>
        {event.event_type}
      </span>
      
      <div className="flex space-x-1">
        <button
          onClick={() => onEdit(event)}
          className="p-1 text-gray-400 hover:text-blue-600"
          title="Edit event"
        >
          ✏️
        </button>
        <button
          onClick={() => onDelete(event.id)}
          className="p-1 text-gray-400 hover:text-red-600"
          title="Delete event"
        >
          🗑️
        </button>
      </div>
    </div>
  )
}
