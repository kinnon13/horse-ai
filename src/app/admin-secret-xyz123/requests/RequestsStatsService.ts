// Queries: paginated with limit
import { supabase } from '@/lib/supabase'
import { DispatchStats } from './RequestsTypes'

export async function fetchDispatchStats(): Promise<DispatchStats> {
  try {
    const { data: requestStats } = await supabase
      .from('service_requests')
      .select('status')

    const { data: providerStats } = await supabase
      .from('providers')
      .select('is_verified')

    const totalRequests = requestStats?.length || 0
    const openRequests = requestStats?.filter(r => r.status === 'open').length || 0
    const claimedRequests = requestStats?.filter(r => r.status === 'claimed').length || 0
    const completedRequests = requestStats?.filter(r => r.status === 'completed').length || 0
    const totalProviders = providerStats?.length || 0
    const verifiedProviders = providerStats?.filter(p => p.is_verified).length || 0

    return {
      totalRequests,
      openRequests,
      claimedRequests,
      completedRequests,
      totalProviders,
      verifiedProviders
    }
  } catch (error) {
    console.error('Error fetching dispatch stats:', error)
    throw error
  }
}
