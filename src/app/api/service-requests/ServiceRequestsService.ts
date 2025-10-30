import { supabaseAdmin } from '@/lib/supabase'
import { dispatchJob } from '@/services/dispatch/ProviderDispatchService'

export class ServiceRequestsService {
  async createServiceRequest(requestData: any) {
    if (!supabaseAdmin) {
      throw new Error('Database not available')
    }

    const { data: serviceRequest, error } = await supabaseAdmin
      .from('service_requests')
      .insert([{
        ...requestData,
        status: 'pending',
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return serviceRequest
  }

  async dispatchToProviders(serviceRequest: any) {
    try {
      const dispatchResult = await dispatchJob({jobId: serviceRequest.id,
        type: serviceRequest.request_type,
        city: serviceRequest.location_city,
        state: serviceRequest.location_state,
        neededAtISO: serviceRequest.preferred_date || serviceRequest.created_at,
        payoutUSD: serviceRequest.budget || 100
      })
      return dispatchResult
    } catch (error) {
      console.error('Dispatch error:', error)
      return { success: false, error: error.message }
    }
  }

  async getServiceRequests(filters: any) {
    if (!supabaseAdmin) {
      throw new Error('Database not available')
    }

    let query = supabaseAdmin
      .from('service_requests')
      .select('*')

    if (filters.userId) query = query.eq('user_id', filters.userId)
    if (filters.status) query = query.eq('status', filters.status)
    if (filters.requestType) query = query.eq('request_type', filters.requestType)

    query = query.order('created_at', { ascending: false })
    query = query.limit(filters.limit || 50)

    const { data: requests, error } = await query

    if (error) throw error
    return requests || []
  }

  async updateServiceRequest(requestId: string, updates: any) {
    if (!supabaseAdmin) {
      throw new Error('Database not available')
    }

    const { data: request, error } = await supabaseAdmin
      .from('service_requests')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId)
      .select()
      .single()

    if (error) throw error
    return request
  }

  async deleteServiceRequest(requestId: string) {
    if (!supabaseAdmin) {
      throw new Error('Database not available')
    }

    const { error } = await supabaseAdmin
      .from('service_requests')
      .delete()
      .eq('id', requestId)

    if (error) throw error
    return { success: true }
  }
}
