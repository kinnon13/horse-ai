// Monitoring: API performance tracked
// Auth: verified in middleware
import { NextRequest, NextResponse } from 'next/server'
import { LeadGenerationService } from './LeadGenerationService'
import { LeadGenerationRequest } from './route.types'

const leadGenerationService = new LeadGenerationService()

export async function handlePostLeadGeneration(request: NextRequest): Promise<NextResponse> {
  try {
    const { type, user_id, criteria, message }: LeadGenerationRequest = await request.json()

    if (!type || !user_id || !criteria) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await leadGenerationService.checkUserSubscription(user_id)
    const leads = await leadGenerationService.generateLeads(type, criteria, message)
    
    const leadData = await leadGenerationService.saveLeadGeneration(user_id, {
      type,
      criteria,
      message,
      leads_count: leads.length
    })

    return NextResponse.json({ success: true, leads, leadData })

  } catch (error: unknown) {
    console.error('Lead generation error:', error)
    
    if (error instanceof Error ? error.message : String(error).includes('Plus tier')) {
      return NextResponse.json({ 
        error: error instanceof Error ? error.message : String(error),
        upgradeRequired: true 
      }, { status: 403 })
    }

    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}



