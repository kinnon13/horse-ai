import { CalendarEvent, CalendarFilters } from './CalendarTypes'
import { supabase } from '@/lib/supabase'

export async function fetchAvailableSlots(filters: CalendarFilters): Promise<CalendarEvent[]> {
  const searchParams = new URLSearchParams()
  if (filters.user_id) searchParams.set('user_id', filters.user_id)
  if (filters.event_type) searchParams.set('event_type', filters.event_type)
  if (filters.status) searchParams.set('status', filters.status)
  if (filters.start_date) searchParams.set('start_date', filters.start_date)
  if (filters.end_date) searchParams.set('end_date', filters.end_date)
  if (filters.limit) searchParams.set('limit', filters.limit.toString())

  const response = await fetch(`/api/calendar?${searchParams}`)
  if (!response.ok) {
    throw new Error('Failed to fetch calendar events')
  }
  
  return response.json()
}

export async function getCalendarEvents(filters: CalendarFilters): Promise<CalendarEvent[]> {
  const { data, error } = await supabase
    .from('calendar_events')
    .select(`
      *,
      horses (
        id,
        reg_name,
        sex,
        yob
      )
    `)
    .eq('user_id', filters.user_id || '')
    .order('event_date', { ascending: true })

  if (error) throw error
  return data || []
}

