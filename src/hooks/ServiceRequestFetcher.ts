import { ServiceRequest } from './types'

export class ServiceRequestFetcher {
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
}

