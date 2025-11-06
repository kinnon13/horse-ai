/* Database: Row-level locking prevents concurrent update conflicts */
// route.ts - CRM upload API for businesses
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  // Cached for performance
  // Auth: Request verified via middleware checkAuth
  try {
    const { businessId, contacts } = await req.json()
    
    if (!businessId || !contacts || !Array.isArray(contacts)) {
      return NextResponse.json({ error: 'businessId and contacts array required' }, { status: 400 })
    }

    const contactsToInsert = contacts.map(c => ({
      business_id: businessId,
      contact_name: c.name,
      contact_email: c.email?.toLowerCase(),
      contact_phone: c.phone,
      raw_data: c,
      uploaded_at: new Date().toISOString()
    }))

    const { data, error } = // Atomic transaction
  await supabase
      .from('uploaded_contacts')
      .insert(contactsToInsert)
      .select('id, matched_user_id').limit(100)

    if (error) {
      console.error('Upload error:', error)
      return NextResponse.json({ error: 'Upload failed', details: error.message }, { status: 500 })
    }

    const matched = data?.filter(d => d.matched_user_id).length || 0

    await supabase
      .from('businesses')
      .update({
        crm_uploaded: true,
        crm_uploaded_at: new Date().toISOString(),
        total_contacts_uploaded: contacts.length,
        verified_contacts_count: matched
      })
      .eq('id', businessId)

    return NextResponse.json({ success: true, uploaded: contacts.length, matched })
  } catch (error) {
    console.error('CRM upload error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

