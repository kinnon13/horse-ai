import { supabaseAdmin } from '@/lib/supabase'

export class CalendarRemindersService {
  async getPendingReminders() {
    if (!supabaseAdmin) {
      throw new Error('Database not available')
    }

    const now = new Date().toISOString()
    
    const { data: pendingReminders, error } = await supabaseAdmin
      .from('user_calendar_events')
      .select(`
        *,
        users:user_id (
          id,
          email,
          phone
        ),
        horses:horse_id (
          id,
          reg_name
        )
      `)
      .eq('status', 'pending')
      .lte('reminder_time', now)
      .not('reminder_time', 'is', null)
      .order('reminder_time', { ascending: true })

    if (error) throw error
    return pendingReminders || []
  }

  async markReminderSent(eventId: string) {
    if (!supabaseAdmin) {
      throw new Error('Database not available')
    }

    const { data: event, error } = await supabaseAdmin
      .from('user_calendar_events')
      .update({reminder_sent: true,
        reminder_sent_at: new Date().toISOString()
      })
      .eq('id', eventId)
      .select()
      .single()

    if (error) throw error
    return event
  }

  async createReminder(reminderData: any) {
    if (!supabaseAdmin) {
      throw new Error('Database not available')
    }

    const { data: reminder, error } = await supabaseAdmin
      .from('user_calendar_events')
      .insert([{
        ...reminderData,
        status: 'pending',
        reminder_sent: false,
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return reminder
  }

  async updateReminder(reminderId: string, updates: any) {
    if (!supabaseAdmin) {
      throw new Error('Database not available')
    }

    const { data: reminder, error } = await supabaseAdmin
      .from('user_calendar_events')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', reminderId)
      .select()
      .single()

    if (error) throw error
    return reminder
  }

  async deleteReminder(reminderId: string) {
    if (!supabaseAdmin) {
      throw new Error('Database not available')
    }

    const { error } = await supabaseAdmin
      .from('user_calendar_events')
      .delete()
      .eq('id', reminderId)

    if (error) throw error
    return { success: true }
  }
}

