import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { Database } from '@/lib/supabase'
import { getProducerHorses, createProducerHorse, updateProducerHorse, deleteProducerHorse, verifyProducerOwnership, verifyHorseOwnership } from './ProducerHorseService'
import { validateProducerHorse, validateProducerHorseUpdate } from './ProducerHorseValidator'

async function getSupabaseAuthUser() {
  const cookieStore = await cookies()
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name: string) => cookieStore.get(name)?.value } }
  )
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    throw new Error('Unauthorized')
  }
  return user
}

export async function GET(request: NextRequest) {
  try {
    const user = await getSupabaseAuthUser()
    const { searchParams } = new URL(request.url)
    const producerId = searchParams.get('producer_id')

    if (!producerId) {
      return NextResponse.json({ error: 'Producer ID required' }, { status: 400 })
    }

    const horses = await getProducerHorses(producerId)
    return NextResponse.json({ horses }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: error.message === 'Unauthorized' ? 401 : 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSupabaseAuthUser()
    const body = await request.json()
    
    if (user.id !== body.producer_id) {
      return NextResponse.json({ error: 'Unauthorized to create horse for this producer' }, { status: 403 })
    }

    const isValidOwner = await verifyProducerOwnership(body.producer_id, user.id)
    if (!isValidOwner) {
      return NextResponse.json({ error: 'Producer not found or access denied' }, { status: 403 })
    }

    const validatedData = validateProducerHorse(body)
    const newHorse = await createProducerHorse(validatedData)
    return NextResponse.json({ horse: newHorse }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: error.message.includes('Missing required field') || error.message.includes('Invalid') ? 400 : 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getSupabaseAuthUser()
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: 'Horse ID required' }, { status: 400 })
    }

    const isValidOwner = await verifyHorseOwnership(id, user.id)
    if (!isValidOwner) {
      return NextResponse.json({ error: 'Horse not found or access denied' }, { status: 403 })
    }

    const validatedData = validateProducerHorseUpdate(updateData)
    const updatedHorse = await updateProducerHorse(id, validatedData)
    return NextResponse.json({ horse: updatedHorse }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: error.message.includes('Invalid') ? 400 : 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getSupabaseAuthUser()
    const { searchParams } = new URL(request.url)
    const horseId = searchParams.get('id')

    if (!horseId) {
      return NextResponse.json({ error: 'Horse ID required' }, { status: 400 })
    }

    const isValidOwner = await verifyHorseOwnership(horseId, user.id)
    if (!isValidOwner) {
      return NextResponse.json({ error: 'Horse not found or access denied' }, { status: 403 })
    }

    await deleteProducerHorse(horseId)
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
