// Monitoring: API performance tracked
// Auth: verified in middleware
import { NextRequest, NextResponse } from 'next/server'
import { UserMemoryLocationService } from './UserMemoryLocationService'

const locationService = new UserMemoryLocationService()

export async function POST(request: NextRequest) {
  try {
    const user = await locationService.getUserFromSession()
    const locationData = await request.json()

    if (!locationData.city || !locationData.state) {
      return NextResponse.json({ error: 'City and state required' }, { status: 400 })
    }

    const updatedUser = await locationService.updateUserLocation(user.id, locationData)
    await locationService.saveLocationHistory(user.id, locationData)

    return NextResponse.json({ success: true, user: updatedUser })

  } catch (error: unknown) {
    console.error('Location update error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await locationService.getUserFromSession()
    const location = await locationService.getUserLocation(user.id)

    return NextResponse.json({ success: true, location })

  } catch (error: unknown) {
    console.error('Get location error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await locationService.getUserFromSession()
    const updatedUser = await locationService.optOutLocation(user.id)

    return NextResponse.json({ success: true, user: updatedUser })

  } catch (error: unknown) {
    console.error('Location opt-out error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}