import { supabase } from '@/lib/supabase'
import { ServiceRequest } from './RequestsTypes'

export async function fetchServiceRequestsWithDetails(): Promise<ServiceRequest[]> {
  try {
    const { data: requests, error } = await supabase
      .from('service_requests')
      .select(`
        *,
        users!service_requests_user_id_fkey(name, email),
        provider_claims(*)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    return requests?.map(request => ({
      ...request,
      user_name: request.users?.name,
      user_email: request.users?.email
    })) || []
  } catch (error) {
    console.error('Error fetching service requests:', error)
    throw error
  }
}

export async function updateServiceRequestStatus(id: string, status: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('service_requests')
      .update({ status })
      .eq('id', id)

    if (error) throw error
  } catch (error) {
    console.error('Error updating service request:', error)
    throw error
  }
}

