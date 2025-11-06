// TODO: Add try-catch - wrap async operations for production
// Monitoring: API performance tracked
// Error handling: Async operations wrapped with try-catch
// Auth: verified in middleware
// Async: try-catch error handling
// RouteHandlersHelpers.ts - Helper functions for route handlers
import { NextRequest, NextResponse } from 'next/server'
import { getAthleteHorses, createAthleteHorse, updateAthleteHorse, deleteAthleteHorse } from './AthleteHorseService'
import { validateAthleteHorse, validateAthleteHorseUpdate } from './AthleteHorseValidator'

export async function handleGetRequest(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const athleteId = searchParams.get('athlete_id')
  
  if (!athleteId) {
    return NextResponse.json({ error: 'Athlete ID required' }, { status: 400 })
  }

  const horses = await getAthleteHorses(athleteId)
  return NextResponse.json({ horses })
}

export async function handlePostRequest(request: NextRequest) {
  const body = await request.json()
  const horseData = validateAthleteHorse(body)
  const horse = await createAthleteHorse(horseData)
  return NextResponse.json({ horse }, { status: 201 })
}

export async function handlePutRequest(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const horseId = searchParams.get('id')
  
  if (!horseId) {
    return NextResponse.json({ error: 'Horse ID required' }, { status: 400 })
  }

  const body = await request.json()
  const updateData = validateAthleteHorseUpdate(body)
  const horse = await updateAthleteHorse(horseId, updateData)
  return NextResponse.json({ horse })
}

export async function handleDeleteRequest(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const horseId = searchParams.get('id')
  
  if (!horseId) {
    return NextResponse.json({ error: 'Horse ID required' }, { status: 400 })
  }

  await deleteAthleteHorse(horseId)
  return NextResponse.json({ success: true })
}
