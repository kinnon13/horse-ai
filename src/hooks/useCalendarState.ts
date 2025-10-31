import { useState } from 'react'
import { CalendarState, CalendarEvent } from './CalendarTypes'

export function useCalendarState(): CalendarState {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [pendingRequest, setPendingRequest] = useState(false)

  return {
    events,
    loading,
    error,
    selectedSlot,
    pendingRequest,
    setEvents,
    setLoading,
    setError,
    setSelectedSlot,
    setPendingRequest
  }
}




