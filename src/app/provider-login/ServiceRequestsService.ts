import { ServiceRequest } from './ProviderLoginTypes'
import { supabase } from '@/lib/supabase'

export async function fetchServiceRequests(): Promise<ServiceRequest[]> {
  try {
    const { data, error } = await supabase
      .from('service_requests')
      .select(`
        *,
        provider_claims(id, provider_id, status, quoted_price, message),
        users(is_minor, guardian_name, guardian_phone)
      `)
      .eq('status', 'open')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching service requests:', error)
    return []
  }
}




