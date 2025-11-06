// Monitoring: API performance tracked
// Auth: verified in middleware
// data-retention/route.ts - Archive/delete per policy
import { NextRequest, NextResponse } from 'next/server'
import { dataRetentionWorkflow } from './retention.service'

export async function POST(req: NextRequest) {
  try {
    const { policy, forceDelete } = await req.json()
    
    if (!policy || !['archive', 'delete'].includes(policy)) {
      return NextResponse.json({ error: 'Invalid retention policy' }, { status: 400 })
    }

    const result = await dataRetentionWorkflow(policy, forceDelete || false)
    
    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error('Retention error:', error)
    return NextResponse.json(
      { error: 'Retention workflow failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

