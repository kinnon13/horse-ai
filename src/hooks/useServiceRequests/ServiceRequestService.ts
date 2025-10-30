import { supabase } from '@/lib/supabase'
import { ServiceRequest, ServiceRequestFilters, CreateServiceRequestData } from './types'

export class ServiceRequestService {
  async fetchServiceRequests(filters: ServiceRequestFilters = {}): Promise<ServiceRequest[]> {
    try {
      let query = supabase
        .from('service_requests')
        .select(`
          *,
          providers:provider_claims(
            id,
            provider_id,
            message,
            quoted_price,
            status,
            created_at,
            providers(
              id,
              business_name,
              contact_name,
              phone,
              email,
              service_type,
              specialty
            )
          )
        `)
        .order('created_at', { ascending: false })

      if (filters.user_id) {
        query = query.eq('user_id', filters.user_id)
      }
      if (filters.status) {
        query = query.eq('status', filters.status)
      }
      if (filters.request_type) {
        query = query.eq('request_type', filters.request_type)
      }
      if (filters.location_city) {
        query = query.eq('location_city', filters.location_city)
      }
      if (filters.location_state) {
        query = query.eq('location_state', filters.location_state)
      }
      if (filters.date_from) {
        query = query.gte('created_at', filters.date_from)
      }
      if (filters.date_to) {
        query = query.lte('created_at', filters.date_to)
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching service requests:', error)
      return []
    }
  }

  async createServiceRequest(data: CreateServiceRequestData, userId: string): Promise<ServiceRequest | null> {
    try {
      const { data: result, error } = await supabase
        .from('service_requests')
        .insert([{
          ...data,
          user_id: userId,
          status: 'open',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) throw error
      return result
    } catch (error) {
      console.error('Error creating service request:', error)
      return null
    }
  }

  async updateServiceRequest(id: string, updates: Partial<ServiceRequest>): Promise<ServiceRequest | null> {
    try {
      const { data, error } = await supabase
        .from('service_requests')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating service request:', error)
      return null
    }
  }

  async deleteServiceRequest(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('service_requests')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting service request:', error)
      return false
    }
  }

  async getServiceRequestById(id: string): Promise<ServiceRequest | null> {
    try {
      const { data, error } = await supabase
        .from('service_requests')
        .select(`
          *,
          providers:provider_claims(
            id,
            provider_id,
            message,
            quoted_price,
            status,
            created_at,
            providers(
              id,
              business_name,
              contact_name,
              phone,
              email,
              service_type,
              specialty
            )
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching service request:', error)
      return null
    }
  }
}

