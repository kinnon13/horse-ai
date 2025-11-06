import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { entityId, entityType, name, email, phone, relationship, proof } = body

    // Validation
    if (!entityId || !name || !email || !relationship || !proof) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Store claim request (in a real system, this would go to a claims review table)

    // For production: Insert into a claims_requests table
    // await supabase.from('entity_claims').insert({
    //   entity_id: entityId,
    //   entity_type: entityType,
    //   claimant_name: name,
    //   claimant_email: email,
    //   claimant_phone: phone,
    //   relationship,
    //   proof_description: proof,
    //   status: 'pending',
    //   submitted_at: new Date().toISOString()
    // })

    // Send notification email to admin
    // await sendEmail({
    //   to: 'claims@horsegpt.ai',
    //   subject: `New Claim Request: ${entityType}`,
    //   html: `Claim request for ${entityId} by ${name} (${email})`
    // })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Claim submit error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    )
  }
}


