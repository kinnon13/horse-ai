import React from 'react'
import { CalendarEvent } from './CalendarTypes'
import { EVENT_TYPE_COLORS, formatEventDate, formatEventTime } from './CalendarConstants'

interface CalendarEventCardProps {
  event: CalendarEvent
  onEdit: (event: CalendarEvent) => void
  onDelete: (eventId: string) => void
}

export function CalendarEventCard({ event, onEdit, onDelete }: CalendarEventCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
          <div className="mt-1 flex items-center space-x-4 text-sm text-gray-600">
            <span>{formatEventDate(event.start_date)}</span>
            <span>{formatEventTime(event.start_date)}</span>
            {event.end_date && (
              <span>to {formatEventTime(event.end_date)}</span>
            )}
          </div>
          {event.location && (
            <p className="mt-1 text-sm text-gray-600">📍 {event.location}</p>
          )}
          {event.description && (
            <p className="mt-2 text-sm text-gray-700">{event.description}</p>
          )}
        </div>
        
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
      </div>
    </div>
  )
}

