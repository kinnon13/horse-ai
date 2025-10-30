import { NextRequest, NextResponse } from 'next/server'
import { getCalendarEvents, createCalendarEvent, updateCalendarEvent, deleteCalendarEvent } from './CalendarService'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filters = { userId: searchParams.get('user_id') || undefined, eventType: searchParams.get('event_type') || undefined, status: searchParams.get('status') || undefined, startDate: searchParams.get('start_date') || undefined, endDate: searchParams.get('end_date') || undefined, limit: parseInt(searchParams.get('limit') || '100') }
    const events = await getCalendarEvents(filters)
    return NextResponse.json({ success: true, events })
  } catch (error: any) {
    console.error('GET /api/calendar error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const event = await createCalendarEvent(body)
    return NextResponse.json({ success: true, event }, { status: 201 })
  } catch (error: any) {
    console.error('POST /api/calendar error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updates } = await request.json()
    if (!id) return NextResponse.json({ error: 'Event ID required' }, { status: 400 })
    const event = await updateCalendarEvent(id, updates)
    return NextResponse.json({ success: true, event })
  } catch (error: any) {
    console.error('PUT /api/calendar error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Event ID required' }, { status: 400 })
    await deleteCalendarEvent(id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('DELETE /api/calendar error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}