import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { ServiceRequest, ServiceRequestFilters, CreateServiceRequestData } from './types'
import { ServiceRequestService } from './ServiceRequestService'

export function useServiceRequests(filters: ServiceRequestFilters = {}) {
  const { user } = useAuth()
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const service = new ServiceRequestService()

  useEffect(() => {
    if (user) {
      fetchServiceRequests()
    } else {
      setServiceRequests([])
      setLoading(false)
    }
  }, [user, JSON.stringify(filters)])

  const fetchServiceRequests = async () => {
    try {
      setLoading(true)
      setError(null)
      const requests = await service.fetchServiceRequests(filters)
      setServiceRequests(requests)
    } catch (err) {
      setError('Failed to fetch service requests')
      console.error('Error fetching service requests:', err)
    } finally {
      setLoading(false)
    }
  }

  const createServiceRequest = async (data: CreateServiceRequestData): Promise<ServiceRequest | null> => {
    if (!user) return null

    try {
      const newRequest = await service.createServiceRequest(data, user.id)
      if (newRequest) {
        setServiceRequests(prev => [newRequest, ...prev])
      }
      return newRequest
    } catch (err) {
      setError('Failed to create service request')
      console.error('Error creating service request:', err)
      return null
    }
  }

  const updateServiceRequest = async (id: string, updates: Partial<ServiceRequest>): Promise<boolean> => {
    try {
      const updatedRequest = await service.updateServiceRequest(id, updates)
      if (updatedRequest) {
        setServiceRequests(prev => 
          prev.map(req => req.id === id ? updatedRequest : req)
        )
        return true
      }
      return false
    } catch (err) {
      setError('Failed to update service request')
      console.error('Error updating service request:', err)
      return false
    }
  }

  const deleteServiceRequest = async (id: string): Promise<boolean> => {
    try {
      const success = await service.deleteServiceRequest(id)
      if (success) {
        setServiceRequests(prev => prev.filter(req => req.id !== id))
      }
      return success
    } catch (err) {
      setError('Failed to delete service request')
      console.error('Error deleting service request:', err)
      return false
    }
  }

  const getServiceRequestById = async (id: string): Promise<ServiceRequest | null> => {
    try {
      return await service.getServiceRequestById(id)
    } catch (err) {
      console.error('Error fetching service request:', err)
      return null
    }
  }

  return {
    serviceRequests,
    loading,
    error,
    createServiceRequest,
    updateServiceRequest,
    deleteServiceRequest,
    getServiceRequestById,
    refetch: fetchServiceRequests,
    clearError: () => setError(null)
  }
}

export { ServiceRequest, ServiceRequestFilters, CreateServiceRequestData } from './types'
export { ServiceRequestService } from './ServiceRequestService'