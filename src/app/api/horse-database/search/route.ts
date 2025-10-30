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
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 400 })
  }
}
