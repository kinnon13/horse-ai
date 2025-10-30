import { NextRequest, NextResponse } from 'next/server'
import { getPendingNotifications, markNotificationSent, markNotificationFailed, sendEmailNotification, sendSMSNotification, sendInAppNotification } from './NotificationService'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('🔔 Starting notifications worker...')

    const pendingNotifications = await getPendingNotifications()
    console.log(`📬 Found ${pendingNotifications.length} pending notifications`)

    let successCount = 0
    let failureCount = 0

    for (const notification of pendingNotifications) {
      try {
        let deliveryDetails: any

        switch (notification.channel) {
          case 'email':
            deliveryDetails = await sendEmailNotification(notification.users.email, notification.message)
            break
          case 'sms':
            deliveryDetails = await sendSMSNotification(notification.users.phone, notification.message)
            break
          case 'in_app':
            deliveryDetails = await sendInAppNotification(notification.user_id, notification.message)
            break
          default:
            throw new Error(`Unknown channel: ${notification.channel}`)
        }

        await markNotificationSent(notification.id, deliveryDetails)
        successCount++
        console.log(`✅ Sent ${notification.channel} notification to ${notification.users.full_name}`)
      } catch (error: any) {
        console.error(`❌ Failed to send notification ${notification.id}:`, error.message)
        await markNotificationFailed(notification.id, error.message)
        failureCount++
      }
    }

    console.log(`🎯 Notifications worker complete: ${successCount} sent, ${failureCount} failed`)
    return NextResponse.json({ 
      success: true, 
      processed: pendingNotifications.length,
      sent: successCount,
      failed: failureCount
    })

  } catch (error: any) {
    console.error('❌ Notifications worker error:', error)
    return NextResponse.json({ error: 'Worker failed' }, { status: 500 })
  }
}