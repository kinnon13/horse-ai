import { NextRequest, NextResponse } from 'next/server'
import { AlertsService } from './AlertsService'

const alertsService = new AlertsService()

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) return NextResponse.json({ alerts: [] })
    const alerts = await alertsService.getUserAlerts(userId)
    return NextResponse.json({ alerts })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ alerts: [] })
  }
}
export async function POST(request: NextRequest) {
  try {
    const { topic, description, user_id } = await request.json()
    if (!topic || !user_id) return NextResponse.json({ error: 'Topic and user_id required' }, { status: 400 })
    const alert = await alertsService.createAlert(topic, description, user_id)
    return NextResponse.json({ alert })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Failed to create alert' }, { status: 500 })
  }
}
export async function PUT(request: NextRequest) {
  try {
    const { id, ...updates } = await request.json()
    if (!id) return NextResponse.json({ error: 'Alert ID required' }, { status: 400 })
    const alert = await alertsService.updateAlert(id, updates)
    return NextResponse.json({ alert })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Failed to update alert' }, { status: 500 })
  }
}
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Alert ID required' }, { status: 400 })
    await alertsService.deleteAlert(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Failed to delete alert' }, { status: 500 })
  }
}