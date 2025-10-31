// CalendarEventListStates.tsx (20 lines) - Loading and error states
import React from 'react'

export function CalendarEventListLoading() {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="text-gray-500">Loading events...</div>
    </div>
  )
}

export function CalendarEventListError({ error }: { error: string }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-4">
      <div className="text-red-800">Error loading events: {error}</div>
    </div>
  )
}

export function CalendarEventListEmpty() {
  return (
    <div className="text-center py-8">
      <div className="text-gray-500">No events found</div>
      <div className="text-sm text-gray-400 mt-1">Create your first event to get started</div>
    </div>
  )
}
