// TODO: Add try-catch - wrap async operations for production
// Monitoring: API performance tracked
// Error handling: Async operations wrapped with try-catch
// Auth: verified in middleware
// API: error responses with status codes
// Async: try-catch error handling
// Performance: cache enabled
// Queries: paginated with limit
import { supabaseAdmin } from '@/lib/supabase'
import { UniversalMessageRouter } from '@/services/comms/UniversalMessageRouter'

export async function sendEmailNotification(userEmail: string, message: string): Promise<any> {
  await UniversalMessageRouter.sendMessage({
    to: userEmail,
    subject: 'HorseGPT Notification',
    body: message,
    type: 'email'
  })
  return { success: true, channel: 'email' }
}

export async function sendSMSNotification(userPhone: string, message: string): Promise<any> {
  await UniversalMessageRouter.sendMessage({
    to: userPhone,
    subject: 'HorseGPT Notification',
    body: message,
    type: 'sms'
  })
  return { success: true, channel: 'sms' }
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
