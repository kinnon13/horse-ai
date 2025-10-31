// CalendarEventCard.tsx (25 lines) - Single responsibility: Event card container
import React from 'react'
import { CalendarEvent } from '@/hooks/CalendarTypes'
import { CalendarEventDisplay } from './CalendarEventDisplay'
import { CalendarEventActions } from './CalendarEventActions'

interface CalendarEventCardProps {
  event: CalendarEvent
  onEdit: (event: CalendarEvent) => void
  onDelete: (eventId: string) => void
}

export function CalendarEventCard({ event, onEdit, onDelete }: CalendarEventCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
      <div className="flex justify-between items-start">
        <CalendarEventDisplay event={event} />
        <CalendarEventActions 
          event={event} 
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      </div>
    </div>
  )
}

