import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/lib/supabase'
import { getHorsesByOwner, createHorseProfile, updateHorseProfile, deleteHorseProfile } from './HorseProfileService'
import { validateHorseProfile, validateHorseUpdate } from './HorseProfileValidator'

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
    const ownerId = searchParams.get('owner_id')
    
    if (!ownerId) {
      return NextResponse.json({ error: 'Owner ID required' }, { status: 400 })
    }

    const horses = await getHorsesByOwner(ownerId)
    return NextResponse.json({ horses })
  } catch (error) {
    console.error('GET /api/horse-portal/horses error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await getAuthenticatedUser()
    const body = await request.json()
    const horseData = validateHorseProfile(body)
    
    const horse = await createHorseProfile(horseData)
    return NextResponse.json({ horse }, { status: 201 })
  } catch (error) {
    console.error('POST /api/horse-portal/horses error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    await getAuthenticatedUser()
    const { searchParams } = new URL(request.url)
    const horseId = searchParams.get('id')
    
    if (!horseId) {
      return NextResponse.json({ error: 'Horse ID required' }, { status: 400 })
    }

    const body = await request.json()
    const updateData = validateHorseUpdate(body)
    
    const horse = await updateHorseProfile(horseId, updateData)
    return NextResponse.json({ horse })
  } catch (error) {
    console.error('PUT /api/horse-portal/horses error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await getAuthenticatedUser()
    const { searchParams } = new URL(request.url)
    const horseId = searchParams.get('id')
    
    if (!horseId) {
      return NextResponse.json({ error: 'Horse ID required' }, { status: 400 })
    }

    await deleteHorseProfile(horseId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/horse-portal/horses error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Server error' }, { status: 500 })
  }
}