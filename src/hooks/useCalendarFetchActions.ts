import { CalendarState, CalendarFilters } from './CalendarTypes'
import { getCalendarEvents } from './CalendarAvailabilityService'

export function useCalendarFetchActions(
  state: CalendarState,
  filters: CalendarFilters
) {
  const { setEvents, setLoading, setError } = state

  const fetchEvents = async () => {
    try {
      setLoading(true)
      setError(null)
      const events = await getCalendarEvents(filters)
      setEvents(events)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events')
    } finally {
      setLoading(false)
    }
  }

  return { fetchEvents }
}




