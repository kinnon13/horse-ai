// useCalendarHandlers.ts (25 lines) - Single responsibility: Handler factory
import { CalendarEventHandlers } from './CalendarEventHandlers'

export function useCalendarHandlers(
  user: any,
  createEvent: any,
  updateEvent: any,
  deleteEvent: any,
  setShowAddForm: (show: boolean) => void,
  setEditingEvent: (event: any) => void
) {
  const handlers = new CalendarEventHandlers(
    user,
    createEvent,
    updateEvent,
    deleteEvent,
    setShowAddForm,
    setEditingEvent
  )

  return {
    handleCreateEvent: handlers.handleCreateEvent,
    handleUpdateEvent: handlers.handleUpdateEvent,
    handleDeleteEvent: handlers.handleDeleteEvent
  }
}