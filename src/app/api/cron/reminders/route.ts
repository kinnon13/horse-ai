import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Cron job endpoint for sending reminders
export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      console.error('Supabase admin client not available')
      return NextResponse.json({ error: 'Database not available' }, { status: 500 })
    }

    // Get all pending reminders that are due
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

    if (error) {
      console.error('Error fetching pending reminders:', error)
      return NextResponse.json({ error: 'Failed to fetch pending reminders' }, { status: 500 })
    }

    const reminders = pendingReminders || []
    let sentCount = 0

    // Process each reminder
    for (const reminder of reminders) {
      try {
        // Create notification for the reminder
        const reminderMessage = generateReminderMessage(reminder)
        
        const { error: notificationError } = await supabaseAdmin
          .from('notifications_outbox')
          .insert({user_id: reminder.user_id,
            target_phone: reminder.users?.phone,
            target_email: reminder.users?.email,
            message_body: reminderMessage,
            channel: reminder.users?.phone ? 'sms' : 'email',
            status: 'queued',
            created_at: new Date().toISOString()
          })

        if (notificationError) {
          console.error('Error creating reminder notification:', notificationError)
          continue
        }

        // Update the event status to reminded
        const { error: updateError } = await supabaseAdmin
          .from('user_calendar_events')
          .update({status: 'reminded',
            reminded_at: new Date().toISOString()
          })
          .eq('id', reminder.id)

        if (updateError) {
          console.error('Error updating event status:', updateError)
        } else {
          sentCount++
        }
      } catch (error) {
        console.error('Error processing reminder:', error)
      }
    }

    return NextResponse.json({success: true, 
      processed: reminders.length,
      sent: sentCount,
      message: `Processed ${reminders.length} reminders, sent ${sentCount} notifications`
    })
  } catch (error) {
    console.error('Error in reminder cron job:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Helper function to generate reminder messages
function generateReminderMessage(event: any): string {
  const eventDate = new Date(event.event_date)
  const horseName = event.horses?.reg_name ? ` for ${event.horses.reg_name}` : ''
  
  switch (event.event_type) {
    case 'reminder':
      return `Reminder: ${event.event_title}${horseName}. ${event.notes || ''}`
    
    case 'show_date':
      return `Show reminder: ${event.event_title}${horseName} is coming up on ${eventDate.toLocaleDateString()}. ${event.location_city ? `Location: ${event.location_city}, ${event.location_state}` : ''}`
    
    case 'haul_date':
      return `Hauling reminder: ${event.event_title}${horseName} on ${eventDate.toLocaleDateString()}. ${event.location_city ? `Heading to ${event.location_city}, ${event.location_state}` : ''}`
    
    case 'vet_appointment':
      return `Vet appointment reminder: ${event.event_title}${horseName} on ${eventDate.toLocaleDateString()}. ${event.location_city ? `At ${event.location_city}, ${event.location_state}` : ''}`
    
    case 'farrier_appointment':
      return `Farrier appointment reminder: ${event.event_title}${horseName} on ${eventDate.toLocaleDateString()}. ${event.location_city ? `At ${event.location_city}, ${event.location_state}` : ''}`
    
    case 'entry_deadline':
      return `Entry deadline reminder: ${event.event_title}${horseName} deadline is ${eventDate.toLocaleDateString()}. Don't miss out!`
    
    default:
      return `Reminder: ${event.event_title}${horseName} on ${eventDate.toLocaleDateString()}. ${event.notes || ''}`
  }
}

