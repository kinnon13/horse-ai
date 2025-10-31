// CalendarValidationGuards.ts (25 lines) - Calendar validation logic
import { CalendarEvent } from './CalendarTypes'

export function validateBookingSlot(slot: string, existingEvents: CalendarEvent[]): boolean {
  // Check for double booking
  const conflictingEvent = existingEvents.find(event => 
    event.event_date === slot && 
    event.status !== 'canceled'
  )
  
  if (conflictingEvent) {
    throw new Error('Time slot is already booked')
  }
  
  return true
}

export function validateProviderCoverage(event: CalendarEvent, providerLocation: any): boolean {
  // Check if provider covers the event location
  if (!providerLocation) return false
  
  // Basic radius check (can be enhanced with actual distance calculation)
  const eventLocation = `${event.location_city}, ${event.location_state}`
  const providerLocationStr = `${providerLocation.city}, ${providerLocation.state}`
  
  return eventLocation === providerLocationStr
}

