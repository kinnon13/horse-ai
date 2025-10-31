import { ServiceRequest, CreateServiceRequestData } from './types'

export async function createServiceRequest(data: CreateServiceRequestData): Promise<ServiceRequest> {
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


