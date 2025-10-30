import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/lib/supabase'
import { getAthleteHorses, createAthleteHorse, updateAthleteHorse, deleteAthleteHorse } from './AthleteHorseService'
import { validateAthleteHorse, validateAthleteHorseUpdate } from './AthleteHorseValidator'

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
    const athleteId = searchParams.get('athlete_id')
    
    if (!athleteId) {
      return NextResponse.json({ error: 'Athlete ID required' }, { status: 400 })
    }

    const horses = await getAthleteHorses(athleteId)
    return NextResponse.json({ horses })
  } catch (error) {
    console.error('GET /api/athlete-portal/horses error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await getAuthenticatedUser()
    const body = await request.json()
    const horseData = validateAthleteHorse(body)
    
    const horse = await createAthleteHorse(horseData)
    return NextResponse.json({ horse }, { status: 201 })
  } catch (error) {
    console.error('POST /api/athlete-portal/horses error:', error)
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
    const updateData = validateAthleteHorseUpdate(body)
    
    const horse = await updateAthleteHorse(horseId, updateData)
    return NextResponse.json({ horse })
  } catch (error) {
    console.error('PUT /api/athlete-portal/horses error:', error)
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

    await deleteAthleteHorse(horseId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/athlete-portal/horses error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Server error' }, { status: 500 })
  }
}