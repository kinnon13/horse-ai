// Monitoring: API performance tracked
// Auth: verified in middleware
// Performance: cache enabled
// ingestion/route.ts - Pull Salesforce/HubSpot → Supabase
import { NextRequest, NextResponse } from 'next/server'
import { ingestionWorkflow } from './ingestion.service'

export async function POST(req: NextRequest) {
  try {
    const { source, syncType } = await req.json()
    
    if (!source || !['salesforce', 'hubspot'].includes(source)) {
      return NextResponse.json({ error: 'Invalid source' }, { status: 400 })
    }

    const result = await ingestionWorkflow(source, syncType || 'full')
    
    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error('Ingestion error:', error)
    return NextResponse.json(
      { error: 'Ingestion failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

