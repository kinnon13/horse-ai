import { NextRequest, NextResponse } from 'next/server'
import { getBusiness360, getRelationships } from '@/lib/entityIntelligence'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const businessId = id
    if (!businessId) {
      return NextResponse.json({ error: 'Business ID required' }, { status: 400 })
    }
    const business360 = await getBusiness360(businessId)
    const relationships = await getRelationships(businessId)
    return NextResponse.json({ success: true, business: business360, relationships })
  } catch (error) {
    console.error('Entity 360 error:', error)
    return NextResponse.json({ error: 'Failed to fetch business data' }, { status: 500 })
  }
}
