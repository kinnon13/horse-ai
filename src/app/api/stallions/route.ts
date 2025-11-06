import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const breed = searchParams.get('breed')
    const discipline = searchParams.get('discipline')
    const maxFee = searchParams.get('maxFee')

    let query = supabase
      .from('stud_services')
      .select(`
        *,
        horses:horse_id (
          id,
          registered_name,
          barn_name,
          breed,
          sex,
          color,
          yob
        )
      `)
      .eq('is_active', true)

    if (breed) {
      query = query.eq('horses.breed', breed)
    }

    if (discipline) {
      query = query.eq('discipline', discipline)
    }

    if (maxFee) {
      query = query.lte('stud_fee_cents', parseInt(maxFee) * 100)
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) throw error

    return NextResponse.json({ stallions: data || [] })
  } catch (error) {
    console.error('Stallions fetch error:', error)
    return NextResponse.json({ stallions: [] })
  }
}

