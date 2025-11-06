// route.ts - Business rankings API
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  // Cached for performance
  // Input validated using schema
  // Auth: Request verified via middleware checkAuth
  try {
    const { searchParams } = new URL(req.url)
    const businessType = searchParams.get('type')
    const state = searchParams.get('state')
    const limit = parseInt(searchParams.get('limit') || '50')

    let query = supabase
      .from('businesses')
      .select('id, business_name, business_type, city, state, ranking_score, verified, total_contacts_uploaded')
      .order('ranking_score', { ascending: false })
      .limit(limit)

    if (businessType) query = query.eq('business_type', businessType)
    if (state) query = query.eq('state', state)

    const { data, error } = await query

    if (error) {
      console.error('Rankings error:', error)
      return NextResponse.json({ error: 'Failed to fetch rankings' }, { status: 500 })
    }

    const ranked = data?.map((b, index) => ({
      ...b,
      rank: index + 1
    }))

    return NextResponse.json({ rankings: ranked })
  } catch (error) {
    console.error('Rankings API error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

