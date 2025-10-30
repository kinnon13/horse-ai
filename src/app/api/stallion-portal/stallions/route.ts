import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/lib/supabase'
import { getStallionsByStation, createStallionProfile, updateStallionProfile, deleteStallionProfile } from './StallionProfileService'
import { validateStallionProfile, validateStallionUpdate } from './StallionProfileValidator'

async function getAuthenticatedUser() {
  const cookieStore = await cookies()
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name: string) => cookieStore.get(name)?.value } }
  )

  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  return user
}

export async function GET(request: NextRequest) {
  try {
    await getAuthenticatedUser()
    const { searchParams } = new URL(request.url)
    const stationId = searchParams.get('station_id')
    
    if (!stationId) {
      return NextResponse.json({ error: 'Station ID required' }, { status: 400 })
    }

    const stallions = await getStallionsByStation(stationId)
    return NextResponse.json({ stallions })
  } catch (error) {
    console.error('GET /api/stallion-portal/stallions error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await getAuthenticatedUser()
    const body = await request.json()
    const stallionData = validateStallionProfile(body)
    
    const stallion = await createStallionProfile(stallionData)
    return NextResponse.json({ stallion }, { status: 201 })
  } catch (error) {
    console.error('POST /api/stallion-portal/stallions error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    await getAuthenticatedUser()
    const { searchParams } = new URL(request.url)
    const stallionId = searchParams.get('id')
    
    if (!stallionId) {
      return NextResponse.json({ error: 'Stallion ID required' }, { status: 400 })
    }

    const body = await request.json()
    const updateData = validateStallionUpdate(body)
    
    const stallion = await updateStallionProfile(stallionId, updateData)
    return NextResponse.json({ stallion })
  } catch (error) {
    console.error('PUT /api/stallion-portal/stallions error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await getAuthenticatedUser()
    const { searchParams } = new URL(request.url)
    const stallionId = searchParams.get('id')
    
    if (!stallionId) {
      return NextResponse.json({ error: 'Stallion ID required' }, { status: 400 })
    }

    await deleteStallionProfile(stallionId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/stallion-portal/stallions error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Server error' }, { status: 500 })
  }
}