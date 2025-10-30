import React from 'react'

interface CalendarErrorStateProps {
  error: string
}

export function CalendarErrorState({ error }: CalendarErrorStateProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-600">Error loading calendar events: {error}</p>
      </div>
    </div>
  )
}

