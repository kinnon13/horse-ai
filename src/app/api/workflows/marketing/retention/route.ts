// retention/route.ts - Re-engage inactive users
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { days_inactive = 30 } = await req.json()

    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days_inactive)

    const { data: inactiveUsers, error } = await supabaseAdmin
      .from('users')
      .select('id, email, created_at')
      .lt('last_seen_at', cutoffDate.toISOString())
      .or('last_seen_at.is.null')
      .limit(100)

    if (error) {
      console.error('Retention query error:', error)
      return NextResponse.json({ error: 'Failed to fetch inactive users' }, { status: 500 })
    }

    const notifications = inactiveUsers?.map(user => ({
      user_id: user.id,
      target_email: user.email,
      message_body: `We miss you! Come back to HorseGPT for the latest horse insights.`,
      channel: 'email',
      status: 'queued'
    })) || []

    if (notifications.length > 0) {
      await supabaseAdmin.from('notifications_outbox').insert(notifications)
    }

    return NextResponse.json({ success: true, users_notified: notifications.length })
  } catch (error) {
    console.error('Retention error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
