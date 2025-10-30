import { NextRequest, NextResponse } from 'next/server'
import { FeedbackService } from './FeedbackService'

const feedbackService = new FeedbackService()

export async function POST(request: NextRequest) {
  try {
    const feedbackData = await request.json()

    if (!feedbackData.message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const feedback = await feedbackService.submitFeedback(feedbackData)
    return NextResponse.json({ success: true, feedback }, { status: 201 })

  } catch (error: any) {
    console.error('Feedback submission error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filters = {userId: searchParams.get('userId'),
      feedbackType: searchParams.get('feedbackType'),
      feature: searchParams.get('feature'),
      limit: parseInt(searchParams.get('limit') || '50')
    }

    const feedback = await feedbackService.getFeedback(filters)
    return NextResponse.json({ success: true, feedback })

  } catch (error: any) {
    console.error('Feedback retrieval error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updates } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Feedback ID required' }, { status: 400 })
    }

    const feedback = await feedbackService.updateFeedback(id, updates)
    return NextResponse.json({ success: true, feedback })

  } catch (error: any) {
    console.error('Feedback update error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Feedback ID required' }, { status: 400 })
    }

    await feedbackService.deleteFeedback(id)
    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('Feedback deletion error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}