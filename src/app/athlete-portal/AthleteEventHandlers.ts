// AthleteEventHandlers.ts (30 lines) - Single responsibility: Event CRUD handlers
import { CompetitionEvent } from './AthleteEventTypes'
import { deleteEvent } from './dataOperations'

export class AthleteEventHandlers {
  constructor(
    private setEvents: any,
    private setShowEventForm: (show: boolean) => void,
    private setEditingEvent: (event: CompetitionEvent | null) => void
  ) {}

  handleAddEvent = () => {
    this.setEditingEvent(null)
    this.setShowEventForm(true)
  }

  handleEditEvent = (event: CompetitionEvent) => {
    this.setEditingEvent(event)
    this.setShowEventForm(true)
  }

  handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return
    
    try {
      await deleteEvent(eventId)
      this.setEvents((prev: CompetitionEvent[]) => prev.filter(e => e.id !== eventId))
    } catch (error) {
      console.error('Error deleting event:', error)
    }
  }
}