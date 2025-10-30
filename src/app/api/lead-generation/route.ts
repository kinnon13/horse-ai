import { NextRequest, NextResponse } from 'next/server'
import { LeadGenerationService } from './LeadGenerationService'

const leadGenerationService = new LeadGenerationService()

export async function POST(request: NextRequest) {
  try {
    const { type, user_id, criteria, message } = await request.json()

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

  } catch (error: any) {
    console.error('Lead generation error:', error)
    
    if (error.message.includes('Plus tier')) {
      return NextResponse.json({ 
        error: error.message,
        upgradeRequired: true 
      }, { status: 403 })
    }

    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const { data: leadGenerations, error } = await supabase
      .from('lead_generations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) throw error

    return NextResponse.json({ success: true, leadGenerations: leadGenerations || [] })

  } catch (error: any) {
    console.error('Get lead generations error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}