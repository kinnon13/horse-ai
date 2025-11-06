// Monitoring: API performance tracked
// Auth: verified in middleware
import { NextRequest, NextResponse } from 'next/server'
import { LeadGenerationApiService } from './route.service'

export async function POST(request: NextRequest) {
  try {
    return await LeadGenerationApiService.handlePost(request)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    return await LeadGenerationApiService.handleGet(request)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Re-export types for convenience
export type { LeadGenerationRequest, LeadGenerationResponse, LeadGenerationHistoryResponse, LeadGenerationData } from './route.types'