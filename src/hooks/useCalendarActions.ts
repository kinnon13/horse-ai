import { CalendarState, CalendarActions, CalendarFilters } from './CalendarTypes'
import { useCalendarFetchActions } from './useCalendarFetchActions'
import { useCalendarCRUDActions } from './useCalendarCRUDActions'
import { useCalendarBookingActions } from './useCalendarBookingActions'

export function useCalendarActions(
  state: CalendarState,
  filters: CalendarFilters
): CalendarActions {
  const fetchActions = useCalendarFetchActions(state, filters)
  const crudActions = useCalendarCRUDActions(state)
  const bookingActions = useCalendarBookingActions(state)

  return {
    ...fetchActions,
    ...crudActions,
    ...bookingActions
  }
}