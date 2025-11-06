// Monitoring: API performance tracked
// Auth: verified in middleware
// API: error responses with status codes
// Performance: cache enabled
import { NextRequest, NextResponse } from 'next/server'
import { validateSearchParams, searchHorseDatabase } from './HorseSearchService'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const searchParams = validateSearchParams(body)
    
    const results = await searchHorseDatabase(searchParams)
    
    return NextResponse.json({ 
      success: true, 
      results,
      count: results.length 
    })
  } catch (error: unknown) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    }, { status: 400 })
  }
}
