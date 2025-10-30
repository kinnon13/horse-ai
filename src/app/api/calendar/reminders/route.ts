import { NextRequest, NextResponse } from 'next/server'
import { CalendarRemindersService } from './CalendarRemindersService'

const remindersService = new CalendarRemindersService()

export async function GET(request: NextRequest) {
  try {
    const reminders = await remindersService.getPendingReminders()
    return NextResponse.json({ success: true, reminders })

  } catch (error: any) {
    console.error('Get reminders error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const reminderData = await request.json()

    if (!reminderData.user_id || !reminderData.event_name) {
      return NextResponse.json({ error: 'User ID and event name required' }, { status: 400 })
    }

    const reminder = await remindersService.createReminder(reminderData)
    return NextResponse.json({ success: true, reminder }, { status: 201 })

  } catch (error: any) {
    console.error('Create reminder error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updates } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Reminder ID required' }, { status: 400 })
    }

    const reminder = await remindersService.updateReminder(id, updates)
    return NextResponse.json({ success: true, reminder })

  } catch (error: any) {
    console.error('Update reminder error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Reminder ID required' }, { status: 400 })
    }

    await remindersService.deleteReminder(id)
    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('Delete reminder error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}