// CalendarEventHandlers.ts (45 lines) - Single responsibility: Event CRUD handlers
import { CalendarEvent, CalendarFormData } from './CalendarTypes'
import CalendarUtils from './CalendarUtils'
import { handleCalendarError, showSuccessMessage } from './CalendarErrorHandlers'

export class CalendarEventHandlers {
  constructor(
    private user: any,
    private createEvent: any,
    private updateEvent: any,
    private deleteEvent: any,
    private setShowAddForm: (show: boolean) => void,
    private setEditingEvent: (event: any) => void
  ) {}

  handleCreateEvent = async (formData: CalendarFormData) => {
    if (!this.user) return
    try {
      const validatedData = CalendarUtils.validateEventForm(formData)
      await this.createEvent(validatedData)
      this.setShowAddForm(false)
      showSuccessMessage('Event created')
    } catch (error) {
      handleCalendarError('creating event', error)
    }
  }

  handleUpdateEvent = async (eventId: string, updates: CalendarFormData) => {
    if (!this.user) return
    try {
      const validatedData = CalendarUtils.validateEventForm(updates)
      await this.updateEvent(eventId, validatedData)
      this.setEditingEvent(null)
      showSuccessMessage('Event updated')
    } catch (error) {
      handleCalendarError('updating event', error)
    }
  }

  handleDeleteEvent = async (eventId: string) => {
    if (!this.user) return
    const confirmed = confirm('Are you sure you want to delete this event?')
    if (!confirmed) return
    try {
      await this.deleteEvent(eventId)
      showSuccessMessage('Event deleted')
    } catch (error) {
      handleCalendarError('deleting event', error)
    }
  }
}