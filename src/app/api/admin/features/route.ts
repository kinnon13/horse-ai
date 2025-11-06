import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('feature_flags')
      .select('*')
      .order('feature_name')

    if (error) throw error

    return NextResponse.json({ features: data || [] })
  } catch (error) {
    console.error('Features load error:', error)
    return NextResponse.json({ features: [] })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { feature_name, is_enabled } = await req.json()

    const { error } = await supabase
      .from('feature_flags')
      .update({ 
        is_enabled,
        updated_at: new Date().toISOString()
      })
      .eq('feature_name', feature_name)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Feature toggle error:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

