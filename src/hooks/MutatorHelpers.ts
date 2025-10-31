// MutatorHelpers.ts (35 lines) - Single responsibility: Mutator helper functions
import { ServiceRequest, CreateServiceRequestData } from './types'

export class MutatorHelpers {
  static async makeCreateRequest(data: CreateServiceRequestData): Promise<ServiceRequest> {
    const response = await fetch('/api/service-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    
    if (!response.ok) throw new Error('Failed to create service request')
    
    const result = await response.json()
    return result.serviceRequest
  }

  static async makeUpdateRequest(id: string, updates: Partial<ServiceRequest>): Promise<ServiceRequest> {
    const response = await fetch('/api/service-requests', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates })
    })
    
    if (!response.ok) throw new Error('Failed to update service request')
    
    const result = await response.json()
    return result.request
  }

  static async makeDeleteRequest(id: string): Promise<void> {
    const response = await fetch(`/api/service-requests?id=${id}`, {
      method: 'DELETE'
    })
    
    if (!response.ok) throw new Error('Failed to delete service request')
  }
}

