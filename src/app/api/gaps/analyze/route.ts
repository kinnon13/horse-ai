// analyze route.ts (24 lines) - Gap analysis endpoint
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const { data } = await supabase.from('feature_gaps').select('*').order('priority', { ascending: false }).limit(20)
    return NextResponse.json({ success: true, gaps: data || [], topGap: data?.[0] || null })
  } catch (error) {
    console.error('Gap analysis error:', error)
    return NextResponse.json({ error: 'Failed to analyze gaps' }, { status: 500 })
  }
}

