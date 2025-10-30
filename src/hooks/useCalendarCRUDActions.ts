import { CalendarState } from './CalendarTypes'
import { createCalendarBooking, updateCalendarBooking, deleteCalendarBooking } from './CalendarBookingService'

export function useCalendarCRUDActions(state: CalendarState) {
  const { setError, setPendingRequest } = state

  const createEvent = async (event: Omit<CalendarEvent, 'id' | 'created_at'>) => {
    try {
      setPendingRequest(true)
      await createCalendarBooking(event)
      // Note: fetchEvents will be called by parent component
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event')
    } finally {
      setPendingRequest(false)
    }
  }

  const updateEvent = async (id: string, updates: Partial<CalendarEvent>) => {
    try {
      setPendingRequest(true)
      await updateCalendarBooking(id, updates)
      // Note: fetchEvents will be called by parent component
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update event')
    } finally {
      setPendingRequest(false)
    }
  }

  const deleteEvent = async (id: string) => {
    try {
      setPendingRequest(true)
      await deleteCalendarBooking(id)
      // Note: fetchEvents will be called by parent component
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete event')
    } finally {
      setPendingRequest(false)
    }
  }

  return { createEvent, updateEvent, deleteEvent }
}

