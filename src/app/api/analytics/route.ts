import { NextRequest, NextResponse } from 'next/server'
import { AnalyticsEngine } from '@/lib/analytics'

export async function POST(request: NextRequest) {
  try {
    const { userId, query, niche, resultsCount } = await request.json()

    if (!userId || !query) {
      return NextResponse.json({ error: 'User ID and query required' }, { status: 400 })
    }

    const analytics = new AnalyticsEngine()
    await analytics.trackSearch(query, niche || 'general', resultsCount || 0, userId)

    return NextResponse.json({
      success: true,
      message: 'Search tracked successfully'
    })

  } catch (error) {
    console.error('Analytics tracking error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to track search'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const niche = searchParams.get('niche')
    const type = searchParams.get('type')

    const analytics = new AnalyticsEngine()

    switch (type) {
      case 'insights':
        const insights = await analytics.getNicheInsights(niche || 'all', userId || undefined)
        return NextResponse.json({ success: true, data: insights })

      case 'top-searches':
        const topSearches = await analytics.getTopSearches(userId || undefined, 10)
        return NextResponse.json({ success: true, data: topSearches })

      case 'trending':
        const trending = await analytics.getTrendingTopics(7)
        return NextResponse.json({ success: true, data: trending })

      case 'generate-insights':
        if (!userId) {
          return NextResponse.json({ error: 'User ID required' }, { status: 400 })
        }
        const generatedInsights = await analytics.generateInsights(userId)
        return NextResponse.json({ success: true, data: generatedInsights })

      default:
        return NextResponse.json({ error: 'Invalid analytics type' }, { status: 400 })
    }

  } catch (error) {
    console.error('Analytics retrieval error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve analytics'
    }, { status: 500 })
  }
}
