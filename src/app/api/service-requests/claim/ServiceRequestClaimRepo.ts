import { supabaseAdmin } from '@/lib/supabase'
import { ServiceRequest } from './ServiceRequestClaimTypes'

export class ServiceRequestClaimRepo {
  static async getServiceRequest(requestId: string): Promise<ServiceRequest> {
    if (!supabaseAdmin) throw new Error('Database not available')

    const { data: serviceRequest, error } = await supabaseAdmin
      .from('service_requests')
      .select('status, user_id')
      .eq('id', requestId)
      .single()

    if (error || !serviceRequest) throw new Error('Service request not found')
    return { id: requestId, ...serviceRequest }
  }

  static async updateServiceRequestStatus(requestId: string, status: string): Promise<void> {
    if (!supabaseAdmin) throw new Error('Database not available')

    const { error } = await supabaseAdmin
      .from('service_requests')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId)

    if (error) throw new Error(`Failed to update service request: ${error.message}`)
  }
}