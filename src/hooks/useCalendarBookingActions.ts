import { CalendarState } from './CalendarTypes'
import { requestBookingSlot } from './CalendarBookingService'
import { validateBookingSlot, checkBookingSafety } from './CalendarGuards'

export function useCalendarBookingActions(state: CalendarState) {
  const { setError, setPendingRequest, setSelectedSlot } = state

  const selectSlot = (slot: string | null) => {
    setSelectedSlot(slot)
  }

  const requestBooking = async (slot: string, eventData: any) => {
    try {
      setPendingRequest(true)
      validateBookingSlot(slot, state.events)
      checkBookingSafety(eventData)
      await requestBookingSlot(slot, eventData)
      setSelectedSlot(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to request booking')
    } finally {
      setPendingRequest(false)
    }
  }

  const cancelBooking = async (id: string, updateEvent: (id: string, updates: any) => Promise<void>) => {
    try {
      setPendingRequest(true)
      await updateEvent(id, { status: 'canceled' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel booking')
    } finally {
      setPendingRequest(false)
    }
  }

  return { selectSlot, requestBooking, cancelBooking }
}



