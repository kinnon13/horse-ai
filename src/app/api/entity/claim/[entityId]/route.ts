import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ entityId: string }> }
) {
  try {
    const { entityId } = await context.params

    // Try to find in businesses first
    const { data: business } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', entityId)
      .single()

    if (business) {
      return NextResponse.json({
        type: 'business',
        name: business.business_name,
        businessType: business.business_type,
        location: business.city && business.state ? `${business.city}, ${business.state}` : null,
        website: business.website,
        claimed: business.verified,
        verified: business.verified,
        description: null
      })
    }

    // Try horses_master table
    const { data: horse } = await supabase
      .from('horses_master')
      .select('*')
      .eq('id', entityId)
      .single()

    if (horse) {
      return NextResponse.json({
        type: 'horse',
        name: horse.barn_name || horse.registered_name || 'Unknown',
        breed: horse.breed,
        color: horse.color,
        owner: horse.owner_name || 'Unclaimed',
        claimed: !!horse.owner_id,
        verified: !!horse.owner_id,
        description: null
      })
    }

    // Not found
    return NextResponse.json(
      { error: 'Entity not found' },
      { status: 404 }
    )
  } catch (err) {
    console.error('Entity fetch error:', err)
    return NextResponse.json(
      { error: 'Entity not found' },
      { status: 404 }
    )
  }
}

