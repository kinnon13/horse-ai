import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const competitionId = params.id

    const { data, error } = await supabase
      .from('competition_results')
      .select(`
        *,
        horses:horse_id (barn_name, registered_name),
        users:user_id (email)
      `)
      .eq('competition_id', competitionId)
      .order('placement', { ascending: true })

    if (error) throw error

    return NextResponse.json({ results: data || [] })
  } catch (error) {
    console.error('Results fetch error:', error)
    return NextResponse.json({ results: [] })
  }
}

