// ServiceDirectoryLogic.tsx (25 lines) - Search logic
'use client'

import { useState, useEffect } from 'react'
import { HorseDataRepository, ServiceProvider } from '@/lib/HorseData.repo'

export function useServiceDirectoryLogic() {
  const [providers, setProviders] = useState<ServiceProvider[]>([])
  const [loading, setLoading] = useState(false)
  const [serviceType, setServiceType] = useState('vet')
  const [location, setLocation] = useState('')

  const repo = new HorseDataRepository()

  const searchProviders = async () => {
    setLoading(true)
    try {
      const results = await repo.searchProviders(serviceType, location)
      setProviders(results)
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    searchProviders()
  }, [serviceType])

  return {
    providers,
    loading,
    serviceType,
    setServiceType,
    location,
    setLocation,
    searchProviders
  }
}
