// userAcquisition.ts (49 lines) - User tracking and conversion analytics
import { supabase } from './supabase'

export async function trackEvent(
  userId: string | null,
  sessionId: string,
  eventType: string,
  eventData?: any,
  pageUrl?: string,
  referrer?: string
) {
  await supabase.from('user_events').insert({
    user_id: userId,
    session_id: sessionId,
    event_type: eventType,
    event_data: eventData,
    page_url: pageUrl,
    referrer: referrer
  })
}

export async function trackFunnelStage(userId: string, stage: string) {
  await supabase.from('conversion_funnels').insert({
    user_id: userId,
    funnel_stage: stage
  })
}

export async function getConversionRate() {
  const { data: visits } = await supabase
    .from('conversion_funnels')
    .select('user_id')
    .eq('funnel_stage', 'visit')
  const { data: upgrades } = await supabase
    .from('conversion_funnels')
    .select('user_id')
    .eq('funnel_stage', 'upgraded')
  const visitCount = visits?.length || 0
  const upgradeCount = upgrades?.length || 0
  return {
    visits: visitCount,
    upgrades: upgradeCount,
    rate: visitCount > 0 ? upgradeCount / visitCount : 0
  }
}
