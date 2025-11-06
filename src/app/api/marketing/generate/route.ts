// Monitoring: API performance tracked
// Auth: verified in middleware
// route.ts - Marketing content generation API endpoint
import { NextRequest, NextResponse } from 'next/server'
import { generateMarketingContent } from '@/lib/marketingContentGenerator'

export async function POST(req: NextRequest) {
  try {
    const { topic, channel, audience } = await req.json()
    
    if (!topic || !channel || !audience) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    const content = await generateMarketingContent(topic, channel, audience)
    
    return NextResponse.json({
      success: true,
      content,
      wordCount: content.split(' ').length
    })
  } catch (error) {
    console.error('Content generation error:', error)
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 })
  }
}
