import { supabaseAdmin } from '@/lib/supabase'
import { CalendarEvent } from './CalendarTypes'

export async function updateCalendarEvent(eventId: string, updateData: Partial<CalendarEvent>): Promise<CalendarEvent> {
  if (!supabaseAdmin) throw new Error('Database not available')

  const { data: event, error } = await supabaseAdmin
    .from('user_calendar_events')
    .update({
      ...updateData,
      updated_at: new Date().toISOString()
    })
    .eq('id', eventId)
    .select()
    .single()

  if (error) throw new Error(`Failed to update calendar event: ${error.message}`)
  return event
}

export async function deleteCalendarEvent(eventId: string): Promise<void> {
  if (!supabaseAdmin) throw new Error('Database not available')

  const { error } = await supabaseAdmin
    .from('user_calendar_events')
    .delete()
    .eq('id', eventId)

  if (error) throw new Error(`Failed to delete calendar event: ${error.message}`)
}




