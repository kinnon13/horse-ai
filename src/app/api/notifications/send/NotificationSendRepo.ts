import { supabase } from '@/lib/supabase'

export class NotificationSendRepo {
  static async getUserFCMToken(userId: string): Promise<string | null> {
    const { data: user, error } = await supabase
      .from('users')
      .select('fcm_token')
      .eq('id', userId)
      .single()

    if (error || !user?.fcm_token) {
      return null
    }

    return user.fcm_token
  }

  static async saveNotification(userId: string, notification: any): Promise<void> {
    const { error } = await supabase
      .from('notifications_outbox')
      .insert({
        user_id: userId,
        type: notification.type || 'general',
        title: notification.title,
        message: notification.message,
        status: 'sent',
        created_at: new Date().toISOString()
      })

    if (error) {
      throw new Error(`Failed to save notification: ${error.message}`)
    }
  }
}

