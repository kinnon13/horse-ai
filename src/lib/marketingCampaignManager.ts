// marketingCampaignManager.ts - Marketing campaign management functions
import { supabaseAdmin } from './supabase'

export async function createCampaign(
  name: string,
  content: string,
  channel: string,
  audience: string
) {
  const supabase = supabaseAdmin
  const { data } = await supabase.from('marketing_campaigns').insert({
    campaign_name: name,
    content,
    channel,
    target_audience: audience
  }).select().single()
  
  return data
}

export async function updateCampaignPerformance(
  campaignId: string,
  metrics: { views?: number; clicks?: number; conversions?: number }
) {
  const supabase = supabaseAdmin
  const { data: campaign } = await supabase
    .from('marketing_campaigns')
    .select('performance')
    .eq('id', campaignId)
    .single()
  
  const updated = { ...campaign?.performance, ...metrics }
  
  await supabase
    .from('marketing_campaigns')
    .update({ performance: updated })
    .eq('id', campaignId)
}
