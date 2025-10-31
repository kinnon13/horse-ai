import { NextRequest, NextResponse } from 'next/server'
import { getUser360, getRelationships } from '@/lib/entityIntelligence'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const userId = id
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }
    const user360 = await getUser360(userId)
    const relationships = await getRelationships(userId)
    return NextResponse.json({ success: true, user: user360, relationships })
  } catch (error) {
    console.error('Entity 360 error:', error)
    return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 })
  }
}
