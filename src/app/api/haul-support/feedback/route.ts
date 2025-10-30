import { NextRequest, NextResponse } from 'next/server'
import { HaulSupportFeedbackService } from './HaulSupportFeedbackService'

const haulSupportFeedbackService = new HaulSupportFeedbackService()

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const feedbackData = await request.json()

    const feedback = await haulSupportFeedbackService.submitFeedback(feedbackData, userId)
    return NextResponse.json({ success: true, feedback }, { status: 201 })

  } catch (error: any) {
    console.error('Haul support feedback error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filters = {point_id: searchParams.get('point_id'),
      user_id: searchParams.get('user_id'),
      limit: parseInt(searchParams.get('limit') || '50')
    }

    const feedback = await haulSupportFeedbackService.getFeedback(filters)
    return NextResponse.json({ success: true, feedback })

  } catch (error: any) {
    console.error('Get haul support feedback error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updates } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Feedback ID required' }, { status: 400 })
    }

    const feedback = await haulSupportFeedbackService.updateFeedback(id, updates)
    return NextResponse.json({ success: true, feedback })

  } catch (error: any) {
    console.error('Update haul support feedback error:', error)
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

    await haulSupportFeedbackService.deleteFeedback(id)
    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('Delete haul support feedback error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}