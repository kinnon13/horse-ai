// ServiceRequestCreateHelpers.ts (30 lines) - Create and update operations
import { ServiceRequest, CreateServiceRequestData } from './types'

export class ServiceRequestCreateHelpers {
  static async createServiceRequest(data: CreateServiceRequestData): Promise<ServiceRequest> {
    try {
      const response = await fetch('/api/service-requests', {
        method: 'POST',
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

  static async updateServiceRequest(id: string, updates: Partial<ServiceRequest>): Promise<ServiceRequest> {
    try {
      const response = await fetch('/api/service-requests', {
        method: 'PUT',
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
}

