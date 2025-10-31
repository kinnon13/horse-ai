import { NextRequest, NextResponse } from 'next/server'
import { identifyGaps, researchTopic, storeResearch } from '@/lib/researchEngine'

export async function POST(req: NextRequest) {
  try {
    const { topicOverride } = await req.json()
    let topic = topicOverride
    if (!topic) {
      const gaps = await identifyGaps()
      topic = gaps[0]?.topic
    }
    if (!topic) {
      return NextResponse.json({ error: 'No gaps found' }, { status: 400 })
    }
    const research = await researchTopic(topic)
    await storeResearch(topic, research)
    return NextResponse.json({
      success: true,
      topic,
      researchLength: research.length,
      stored: true
    })
  } catch (error) {
    console.error('Auto research error:', error)
    return NextResponse.json({ error: 'Research failed' }, { status: 500 })
  }
}

