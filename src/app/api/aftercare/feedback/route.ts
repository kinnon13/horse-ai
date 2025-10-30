import { NextRequest, NextResponse } from 'next/server'
import { AftercareFeedbackService } from './AftercareFeedbackService'

const aftercareFeedbackService = new AftercareFeedbackService()

export async function POST(request: NextRequest) {
  try {
    const feedbackData = await request.json()

    const feedback = await aftercareFeedbackService.submitFeedback(feedbackData)
    return NextResponse.json({ success: true, feedback }, { status: 201 })

  } catch (error: any) {
    console.error('Aftercare feedback error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filters = {
      provider_id: searchParams.get('provider_id'),
      user_id: searchParams.get('user_id'),
      ping_id: searchParams.get('ping_id'),
      limit: parseInt(searchParams.get('limit') || '50')
    }

    const feedback = await aftercareFeedbackService.getFeedback(filters)
    return NextResponse.json({ success: true, feedback })

  } catch (error: any) {
    console.error('Get aftercare feedback error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updates } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Feedback ID required' }, { status: 400 })
    }

    const feedback = await aftercareFeedbackService.updateFeedback(id, updates)
    return NextResponse.json({ success: true, feedback })

  } catch (error: any) {
    console.error('Update aftercare feedback error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}