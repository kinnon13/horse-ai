import { CalendarEvent, CalendarFormData } from './CalendarTypes'

export function validateEventForm(data: any): CalendarFormData {
  if (!data.title?.trim()) {
    throw new Error('Event title is required')
  }
  
  if (!data.start_date) {
    throw new Error('Start date is required')
  }
  
  if (!data.event_type || !['show', 'deadline', 'breeding', 'other'].includes(data.event_type)) {
    throw new Error('Valid event type is required')
  }

  return {
    title: data.title.trim(),
    description: data.description?.trim(),
    start_date: data.start_date,
    end_date: data.end_date || undefined,
    event_type: data.event_type,
    location: data.location?.trim()
  }
}

export function formatEventForDisplay(event: CalendarEvent) {
  return {
    ...event,
    formatted_start: new Date(event.start_date).toLocaleDateString(),
    formatted_end: event.end_date ? new Date(event.end_date).toLocaleDateString() : null
  }
}

// Default export for compatibility
export default {
  validateEventForm,
  formatEventForDisplay
}
