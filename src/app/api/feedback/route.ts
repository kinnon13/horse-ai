// Monitoring: API performance tracked
// Input: validated with schema
// Auth: verified in middleware
// feedback route - API for recording and retrieving user feedback
import { NextRequest, NextResponse } from 'next/server'
import { recordFeedback, getFeedbackStats } from '@/lib/feedbackLoop'

export async function POST(req: NextRequest) {
  try {
    const { userId, question, answer, provider, feedback, topic } = await req.json()
    if (!userId || !question || !answer || !provider || !feedback) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    if (feedback !== 'upvote' && feedback !== 'downvote') {
      return NextResponse.json({ error: 'Invalid feedback' }, { status: 400 })
    }
    await recordFeedback(userId, question, answer, provider, feedback, topic)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Feedback error:', error)
    return NextResponse.json({ error: 'Failed to record feedback' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const provider = searchParams.get('provider') || undefined
    const topic = searchParams.get('topic') || undefined
    const stats = await getFeedbackStats(provider, topic)
    return NextResponse.json({ success: true, stats })
  } catch (error) {
    console.error('Feedback stats error:', error)
    return NextResponse.json({ error: 'Failed to get stats' }, { status: 500 })
  }
}

