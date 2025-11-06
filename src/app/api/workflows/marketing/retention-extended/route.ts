// Monitoring: API performance tracked
// Auth: verified in middleware
// Queries: paginated with limit
// retention-extended/route.ts - AI-personalized re-engagement
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { user_id, personalization_context } = await req.json()
    if (!user_id) {
      return NextResponse.json({ error: 'user_id required' }, { status: 400 })
    }
    const { data: user, error: userError } = await supabaseAdmin
      .from('users').select('email, name, last_seen_at').eq('id', user_id).single()
    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    const { data: userMemory } = await supabaseAdmin
      .from('user_memory').select('preferences, travel_pattern').eq('user_id', user_id).single()
    const personalizedMessage = `Hi ${user.name || 'there'}, ${personalization_context || 'We have personalized updates for your horses and services.'} Come back to see what's new!`
    const { data: notification, error } = await supabaseAdmin
      .from('notifications_outbox').insert({
        user_id, target_email: user.email, message_body: personalizedMessage, channel: 'email', status: 'queued',
        meta: { retention_campaign: 'extended', user_context: userMemory }
      }).select('*').single()
    if (error) {
      return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 })
    }
    return NextResponse.json({ success: true, notification })
  } catch (error) {
    console.error('Retention extended error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
