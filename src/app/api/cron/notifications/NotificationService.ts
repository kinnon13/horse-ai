import { supabaseAdmin } from '@/lib/supabase'
import { NotificationRecord } from './NotificationTypes'

export async function getPendingNotifications(): Promise<NotificationRecord[]> {
  const now = new Date().toISOString()
  const { data: notifications, error } = await supabaseAdmin
    .from('notifications_outbox')
    .select(`
      id,
      user_id,
      channel,
      message,
      scheduled_for,
      users!inner(
        id,
        email,
        phone,
        full_name
      )
    `)
    .eq('status', 'pending')
    .lte('scheduled_for', now)
    .order('scheduled_for', { ascending: true })
    .limit(50)

  if (error) throw new Error(`Failed to fetch pending notifications: ${error.message}`)
  return notifications || []
}

export async function markNotificationSent(notificationId: string, deliveryDetails: any): Promise<void> {
  const { error } = await supabaseAdmin
    .from('notifications_outbox')
    .update({
      status: 'sent',
      sent_at: new Date().toISOString(),
      delivery_details: deliveryDetails
    })
    .eq('id', notificationId)

  if (error) throw new Error(`Failed to mark notification as sent: ${error.message}`)
}

export async function markNotificationFailed(notificationId: string, errorMessage: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('notifications_outbox')
    .update({
      status: 'failed',
      error_message: errorMessage,
      failed_at: new Date().toISOString()
    })
    .eq('id', notificationId)

  if (error) throw new Error(`Failed to mark notification as failed: ${error.message}`)
}