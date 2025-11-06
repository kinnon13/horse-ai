import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const stallionId = params.id

    const { data: horse, error: horseError } = await supabase
      .from('horses_master')
      .select('*')
      .eq('id', stallionId)
      .single()

    if (horseError) throw horseError

    const { data: studService } = await supabase
      .from('stud_services')
      .select('*')
      .eq('horse_id', stallionId)
      .single()

    const { data: offspring } = await supabase
      .from('breeding_records')
      .select(`
        *,
        offspring:offspring_id (registered_name, barn_name, yob)
      `)
      .eq('sire_id', stallionId)
      .limit(20)

    return NextResponse.json({
      stallion: {
        ...horse,
        studService,
        offspring: offspring || []
      }
    })
  } catch (error) {
    return NextResponse.json({ 
      error: 'Stallion not found',
      details: error instanceof Error ? error.message : 'Unknown'  
    }, { status: 404 })
  }
}
