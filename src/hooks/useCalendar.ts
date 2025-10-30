import { useEffect } from 'react'
import { CalendarFilters } from './CalendarTypes'
import { useCalendarState } from './useCalendarState'
import { useCalendarActions } from './useCalendarActions'

export function useCalendar(filters: CalendarFilters = {}) {
  const state = useCalendarState()
  const actions = useCalendarActions(state, filters)

  useEffect(() => {
    actions.fetchEvents()
  }, [filters.user_id, filters.event_type, filters.status])

  return {
    ...state,
    ...actions
  }
}