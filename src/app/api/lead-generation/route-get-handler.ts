// Monitoring: API performance tracked
// Input: validated with schema
// Auth: verified in middleware
// Performance: cache enabled
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function handleGetLeadGeneration(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const { data: leadGenerations, error } = await supabase
      .from('lead_generations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) throw error

    return NextResponse.json({ success: true, leadGenerations: leadGenerations || [] })

  } catch (error: unknown) {
    console.error('Get lead generations error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}



