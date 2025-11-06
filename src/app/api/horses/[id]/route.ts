import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const horseId = params.id

    const { data, error } = await supabase
      .from('horses_master')
      .select('*')
      .eq('id', horseId)
      .single()

    if (error) throw error

    return NextResponse.json({ horse: data })
  } catch (error) {
    return NextResponse.json(
      { error: 'Horse not found' },
      { status: 404 }
    )
  }
}
