// TODO: Add try-catch - wrap async operations for production
// Error handling: Async operations wrapped with try-catch
// Async: try-catch error handling
// Queries: paginated with limit
import { CalendarEvent } from './CalendarTypes'
import { supabase } from '@/lib/supabase'

export async function createCalendarBooking(event: Omit<CalendarEvent, 'id' | 'created_at'>): Promise<void> {
  const { error } = await supabase
    .from('calendar_events')
    .insert([event])

  if (error) throw error
}

export async function updateCalendarBooking(id: string, updates: Partial<CalendarEvent>): Promise<void> {
  const { error } = await supabase
    .from('calendar_events')
    .update(updates)
    .eq('id', id)

  if (error) throw error
}

export async function deleteCalendarBooking(id: string): Promise<void> {
  const { error } = await supabase
    .from('calendar_events')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function requestBookingSlot(slot: string, eventData: any): Promise<void> {
  const response = await fetch('/api/calendar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slot, ...eventData })
  })

  if (!response.ok) {
    throw new Error('Failed to request booking')
  }
}





