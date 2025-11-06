// Monitoring: API performance tracked
// Auth: verified in middleware
// product-recommendation/route.ts - AI gear/services recommendations
import { NextRequest, NextResponse } from 'next/server'
import { generateProductRecommendations } from './recommendation.service'

export async function POST(req: NextRequest) {
  try {
    const { userId, horseProfile, preferences, budget } = await req.json()
    
    if (!horseProfile) {
      return NextResponse.json({ error: 'Horse profile required' }, { status: 400 })
    }

    const recommendations = await generateProductRecommendations(
      horseProfile,
      preferences,
      budget
    )
    
    return NextResponse.json({ 
      success: true, 
      recommendations 
    })
  } catch (error) {
    console.error('Product recommendation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    )
  }
}
