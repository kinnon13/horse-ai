import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider'
import type { ProviderType, ServiceRequestType } from './ProviderLoginTypes'
import { fetchProviderData } from './ProviderLoginService'
import { fetchServiceRequests } from './ServiceRequestsService'

export function useProviderLoginState() {
  const { user, loading } = useAuth()
  const [provider, setProvider] = useState<ProviderType | null>(null)
  const [serviceRequests, setServiceRequests] = useState<ServiceRequestType[]>([])
  const [loadingRequests, setLoadingRequests] = useState(true)

  return {
    user,
    loading,
    provider,
    setProvider,
    serviceRequests,
    setServiceRequests,
    loadingRequests,
    setLoadingRequests
  }
}




