// CalendarSafetyGuards.ts (25 lines) - Calendar safety and liability logic
import { CalendarEvent } from './CalendarTypes'

export function getLiabilityText(eventType: string): string {
  const liabilityTexts: { [key: string]: string } = {
    'vet_appointment': 'This is not a medical emergency service. Please contact your veterinarian for medical advice.',
    'farrier_appointment': 'Service provider is responsible for their own insurance and liability.',
    'haul_date': 'Transport service provider is responsible for their own insurance and liability.',
    'show_date': 'Event organizer is responsible for their own insurance and liability.',
    'entry_deadline': 'Deadline information is provided as-is. Please verify with event organizers.',
    'reminder': 'This is a reminder only. Please verify all details independently.'
  }
  
  return liabilityTexts[eventType] || 'Please verify all details independently.'
}

export function checkBookingSafety(event: CalendarEvent): boolean {
  // Safety checks before allowing booking
  if (!event.event_date) return false
  if (!event.event_title) return false
  if (event.event_type === 'vet_appointment' && !event.horse_id) return false
  
  return true
}

