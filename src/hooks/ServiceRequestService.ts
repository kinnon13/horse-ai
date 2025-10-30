import { ServiceRequest, CreateServiceRequestData } from './types'

export class ServiceRequestService {
  async getServiceRequests(filters: any = {}): Promise<ServiceRequest[]> {
    try {
      const params = new URLSearchParams()
      if (filters.status) params.append('status', filters.status)
      if (filters.request_type) params.append('requestType', filters.request_type)
      if (filters.user_id) params.append('userId', filters.user_id)

      const response = await fetch(`/api/service-requests?${params}`)
      if (!response.ok) throw new Error('Failed to fetch service requests')
      
      const data = await response.json()
      return data.requests || []
    } catch (error) {
      console.error('Error fetching service requests:', error)
      throw error
    }
  }

  async createServiceRequest(data: CreateServiceRequestData): Promise<ServiceRequest> {
    try {
      const response = await fetch('/api/service-requests', {method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) throw new Error('Failed to create service request')
      
      const result = await response.json()
      return result.serviceRequest
    } catch (error) {
      console.error('Error creating service request:', error)
      throw error
    }
  }

  async updateServiceRequest(id: string, updates: Partial<ServiceRequest>): Promise<ServiceRequest> {
    try {
      const response = await fetch('/api/service-requests', {method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates })
      })
      
      if (!response.ok) throw new Error('Failed to update service request')
      
      const result = await response.json()
      return result.request
    } catch (error) {
      console.error('Error updating service request:', error)
      throw error
    }
  }

  async deleteServiceRequest(id: string): Promise<void> {
    try {
      const response = await fetch(`/api/service-requests?id=${id}`, {method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Failed to delete service request')
    } catch (error) {
      console.error('Error deleting service request:', error)
      throw error
    }
  }
}

