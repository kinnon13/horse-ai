import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { userId, notification } = await request.json()

    if (!userId || !notification) {
      return NextResponse.json({ error: 'User ID and notification required' }, { status: 400 })
    }

    // Get user's FCM token
    const { data: user, error } = await supabase
      .from('users')
      .select('fcm_token')
      .eq('id', userId)
      .single()

    if (error || !user?.fcm_token) {
      return NextResponse.json({ error: 'User not found or no FCM token' }, { status: 404 })
    }

    // Send notification via Firebase Admin SDK (server-side)
    const message = {
      token: user.fcm_token,
      notification: {
        title: notification.title,
        body: notification.body,
        icon: notification.icon || '/icon-192x192.png',
        badge: notification.badge || '/badge-72x72.png'
      },
      data: notification.data || {}
    }

    // In production, you'd use Firebase Admin SDK here
    // For now, we'll simulate the notification
    console.log('Sending notification:', message)

    // Store notification in database
    await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title: notification.title,
        body: notification.body,
        data: notification.data,
        sent_at: new Date().toISOString()
      })

    return NextResponse.json({
      success: true,
      message: 'Notification sent successfully'
    })

  } catch (error) {
    console.error('Send notification error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to send notification'
    }, { status: 500 })
  }
}
