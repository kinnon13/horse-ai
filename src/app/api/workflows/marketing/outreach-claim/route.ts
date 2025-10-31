// outreach-claim/route.ts - Prospecting + tracking → CRM
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { provider_id, service_type, contact_email, contact_phone, meta } = await req.json()
    
    if (!provider_id && !contact_email && !contact_phone) {
      return NextResponse.json({ error: 'Provider contact required' }, { status: 400 })
    }

    const { data: outreach, error } = await supabaseAdmin
      .from('notifications_outbox')
      .insert({
        provider_id,
        provider_contact_email: contact_email,
        provider_contact_phone: contact_phone,
        message_body: meta?.message || 'New service request opportunity',
        channel: contact_phone ? 'sms' : 'email',
        status: 'queued',
        meta: { service_type, ...meta }
      })
      .select('*')
      .single()

    if (error) {
      console.error('Outreach claim error:', error)
      return NextResponse.json({ error: 'Failed to create outreach' }, { status: 500 })
    }

    return NextResponse.json({ success: true, outreach })
  } catch (error) {
    console.error('Outreach claim error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
