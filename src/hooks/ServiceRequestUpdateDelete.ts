import { ServiceRequest } from './types'

export async function updateServiceRequest(id: string, updates: Partial<ServiceRequest>): Promise<ServiceRequest> {
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

export async function deleteServiceRequest(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/service-requests?id=${id}`, {
      method: 'DELETE'
    })
    
    if (!response.ok) throw new Error('Failed to delete service request')
  } catch (error) {
    console.error('Error deleting service request:', error)
    throw error
  }
}


