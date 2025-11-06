// Monitoring: API performance tracked
// Auth: verified in middleware
import { NextRequest, NextResponse } from 'next/server'
import { getHorse360, getRelationships } from '@/lib/entityIntelligence'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const horseId = id
    if (!horseId) {
      return NextResponse.json({ error: 'Horse ID required' }, { status: 400 })
    }
    const horse360 = await getHorse360(horseId)
    const relationships = await getRelationships(horseId)
    return NextResponse.json({ success: true, horse: horse360, relationships })
  } catch (error) {
    console.error('Entity 360 error:', error)
    return NextResponse.json({ error: 'Failed to fetch horse data' }, { status: 500 })
  }
}
