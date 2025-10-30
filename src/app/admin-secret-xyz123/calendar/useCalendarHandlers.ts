import { CalendarTypes } from './CalendarTypes'
import { CalendarUtils } from './CalendarUtils'

export function useCalendarHandlers(
  user: any,
  createEvent: any,
  updateEvent: any,
  deleteEvent: any,
  setShowAddForm: (show: boolean) => void,
  setEditingEvent: (event: any) => void
) {
  const handleCreateEvent = async (formData: CalendarTypes.CalendarFormData) => {
    if (!user) return
    
    try {
      const validatedData = CalendarUtils.validateEventForm(formData)
      await createEvent(validatedData)
      setShowAddForm(false)
      alert('Event created successfully!')
    } catch (error) {
      console.error('Error creating event:', error)
      alert('Failed to create event')
    }
  }

  const handleUpdateEvent = async (eventId: string, updates: CalendarTypes.CalendarFormData) => {
    if (!user) return
    
    try {
      const validatedData = CalendarUtils.validateEventForm(updates)
      await updateEvent(eventId, validatedData)
      setEditingEvent(null)
      alert('Event updated successfully!')
    } catch (error) {
      console.error('Error updating event:', error)
      alert('Failed to update event')
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    if (!user) return
    
    const confirmed = confirm('Are you sure you want to delete this event?')
    if (!confirmed) return
    
    try {
      await deleteEvent(eventId)
      alert('Event deleted successfully!')
    } catch (error) {
      console.error('Error deleting event:', error)
      alert('Failed to delete event')
    }
  }

  return { handleCreateEvent, handleUpdateEvent, handleDeleteEvent }
}

