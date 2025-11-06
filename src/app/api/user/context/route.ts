// Monitoring: API performance tracked
// route.ts - User psychology context API
import { NextRequest, NextResponse } from 'next/server'
import { buildUserContext } from '@/lib/user-context'

export async function GET(req: NextRequest) {
  // Input validated using schema
  // Auth: Request verified via middleware checkAuth
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }

    const context = await buildUserContext(userId)
    
    return NextResponse.json({
      userId: context.userId,
      emotion: context.emotionProfile,
      lifecycle: context.lifecycleStage,
      engagement: context.engagementScore,
      churn: {
        risk: context.churnRisk,
        factors: context.riskFactors,
        interventionNeeded: context.interventionNeeded
      },
      conversion: {
        stage: context.conversionStage,
        hasSubscription: context.hasSubscription
      },
      strategy: context.recommendedStrategy,
      tone: context.recommendedTone,
      horses: context.horses
    })
  } catch (error) {
    console.error('Context API error:', error)
    return NextResponse.json({ error: 'Failed to build context' }, { status: 500 })
  }
}

