// route.ts - Marketing campaign management API endpoint
import { NextRequest, NextResponse } from 'next/server'
import { createCampaign, updateCampaignPerformance } from '@/lib/marketingCampaignManager'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { name, content, channel, audience } = await req.json()
    
    if (!name || !content || !channel || !audience) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    const campaign = await createCampaign(name, content, channel, audience)
    
    return NextResponse.json({ success: true, campaign })
  } catch (error) {
    console.error('Campaign creation error:', error)
    return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const supabase = supabaseAdmin
    const { data } = await supabase
      .from('marketing_campaigns')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)
    
    return NextResponse.json({ success: true, campaigns: data || [] })
  } catch (error) {
    console.error('Campaign fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 })
  }
}
