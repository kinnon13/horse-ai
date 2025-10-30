import { supabaseAdmin } from '@/lib/supabase'
import { CalendarEvent, CalendarFilters } from './CalendarTypes'

export async function getCalendarEvents(filters: CalendarFilters): Promise<CalendarEvent[]> {
  if (!supabaseAdmin) throw new Error('Database not available')

  let query = supabaseAdmin
    .from('user_calendar_events')
    .select(`
      *,
      horses:horse_id (
        id,
        reg_name,
        sex,
        yob
      )
    `)

  if (filters.userId) query = query.eq('user_id', filters.userId)
  if (filters.eventType) query = query.eq('event_type', filters.eventType)
  if (filters.status) query = query.eq('status', filters.status)
  if (filters.startDate) query = query.gte('event_date', filters.startDate)
  if (filters.endDate) query = query.lte('event_date', filters.endDate)

  query = query.order('event_date', { ascending: true })
  query = query.limit(filters.limit || 100)

  const { data: events, error } = await query

  if (error) throw new Error(`Failed to fetch calendar events: ${error.message}`)
  return events || []
}

export async function createCalendarEvent(eventData: Omit<CalendarEvent, 'id' | 'created_at' | 'updated_at'>): Promise<CalendarEvent> {
  if (!supabaseAdmin) throw new Error('Database not available')

  const { data: event, error } = await supabaseAdmin
    .from('user_calendar_events')
    .insert([eventData])
    .select()
    .single()

  if (error) throw new Error(`Failed to create calendar event: ${error.message}`)
  return event
}