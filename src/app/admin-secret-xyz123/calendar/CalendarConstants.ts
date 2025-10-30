import { CalendarEvent, CalendarFormData } from './CalendarTypes'

export const EVENT_TYPES = [
  { value: 'show', label: 'Show/Competition' },
  { value: 'deadline', label: 'Deadline' },
  { value: 'breeding', label: 'Breeding' },
  { value: 'other', label: 'Other' }
] as const

export const EVENT_TYPE_COLORS = {
  show: 'bg-blue-100 text-blue-800',
  deadline: 'bg-red-100 text-red-800',
  breeding: 'bg-green-100 text-green-800',
  other: 'bg-gray-100 text-gray-800'
} as const

export function formatEventDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

export function formatEventTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

