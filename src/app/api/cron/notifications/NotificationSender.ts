import { supabaseAdmin } from '@/lib/supabase'
import { sendSafeEmail, sendSafeSMS } from '@/services/comms/UniversalMessageRouter'

export async function sendEmailNotification(userEmail: string, message: string): Promise<any> {
  const safe = await sendSafeEmail(userEmail, 'HorseGPT Notification', message)
  return { success: true, channel: 'email', sanitized: safe }
}

export async function sendSMSNotification(userPhone: string, message: string): Promise<any> {
  const safe = await sendSafeSMS(userPhone, message)
  return { success: true, channel: 'sms', sanitized: safe }
}

export async function sendInAppNotification(userId: string, message: string): Promise<any> {
  // Store in-app notification in database
  const { error } = await supabaseAdmin
    .from('user_notifications')
    .insert({
      user_id: userId,
      message: message,
      type: 'system',
      read: false
    })

  if (error) throw new Error(`Failed to create in-app notification: ${error.message}`)
  return { success: true, channel: 'in_app' }
}
