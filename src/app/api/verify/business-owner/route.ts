import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, businessInfo } = body

    if (!token || !businessInfo) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // In production: Create business entry in database

    const { data, error } = await supabase
      .from('businesses')
      .insert({
        business_name: businessInfo.name,
        business_type: businessInfo.type,
        city: businessInfo.location.split(',')[0]?.trim(),
        state: businessInfo.location.split(',')[1]?.trim(),
        verified: false,
        ranking_score: 0
      })

    if (error) {
      console.error('Business insert error:', error)
      // Don't fail the request, just log it
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Business owner verification error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    )
  }
}


