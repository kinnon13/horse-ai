import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export interface Provider {id: string
  business_name: string
  contact_name: string | null
  phone: string | null
  email: string | null
  service_type: string
  specialty: string | null
  city: string | null
  state: string | null
  verified: boolean
  sponsored: boolean
  admin_blocked: boolean
  admin_block_reason: string | null
  provider_last_seen_at: string | null
  provider_active: boolean
  relationship_type: string
  notes: string | null
  created_at: string
  updated_at: string
}

export interface ProviderFilters {
  service_type?: string
  city?: string
  state?: string
  verified?: boolean
  limit?: number
}

export function useProviders(filters: ProviderFilters = {}) {
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProviders = async () => {
    try {
      setLoading(true)
      setError(null)

      const searchParams = new URLSearchParams()
      if (filters.service_type) searchParams.set('service_type', filters.service_type)
      if (filters.city) searchParams.set('city', filters.city)
      if (filters.state) searchParams.set('state', filters.state)
      if (filters.verified !== undefined) searchParams.set('verified', filters.verified.toString())
      if (filters.limit) searchParams.set('limit', filters.limit.toString())

      const response = await fetch(`/api/providers?${searchParams.toString()}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch providers')
      }

      const data = await response.json()
      setProviders(data.providers || [])
    } catch (err) {
      console.error('Error fetching providers:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch providers')
    } finally {
      setLoading(false)
    }
  }

  const createProvider = async (providerData: Omit<Provider, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const response = await fetch('/api/providers', {method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(providerData),
      })

      if (!response.ok) {
        throw new Error('Failed to create provider')
      }

      const data = await response.json()
      
      // Add the new provider to the list
      setProviders(prev => [data.provider, ...prev])
      
      return data.provider
    } catch (err) {
      console.error('Error creating provider:', err)
      throw err
    }
  }

  const updateProvider = async (id: string, updateData: Partial<Provider>) => {
    try {
      const response = await fetch('/api/providers', {method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...updateData }),
      })

      if (!response.ok) {
        throw new Error('Failed to update provider')
      }

      const data = await response.json()
      
      // Update the provider in the list
      setProviders(prev => 
        prev.map(provider => 
          provider.id === id ? data.provider : provider
        )
      )
      
      return data.provider
    } catch (err) {
      console.error('Error updating provider:', err)
      throw err
    }
  }

  const searchProviders = async (query: string, serviceType?: string) => {
    try {
      setLoading(true)
      setError(null)

      const searchParams = new URLSearchParams()
      if (query) {
        // Search by business name, city, or state
        searchParams.set('city', query)
      }
      if (serviceType) searchParams.set('service_type', serviceType)
      searchParams.set('verified', 'true') // Only show verified providers in search

      const response = await fetch(`/api/providers?${searchParams.toString()}`)
      
      if (!response.ok) {
        throw new Error('Failed to search providers')
      }

      const data = await response.json()
      
      // Filter results by query if provided
      let filteredProviders = data.providers || []
      if (query) {
        const lowerQuery = query.toLowerCase()
        filteredProviders = filteredProviders.filter((provider: Provider) =>
          provider.business_name.toLowerCase().includes(lowerQuery) ||
          provider.city?.toLowerCase().includes(lowerQuery) ||
          provider.state?.toLowerCase().includes(lowerQuery) ||
          provider.specialty?.toLowerCase().includes(lowerQuery)
        )
      }
      
      setProviders(filteredProviders)
    } catch (err) {
      console.error('Error searching providers:', err)
      setError(err instanceof Error ? err.message : 'Failed to search providers')
    } finally {
      setLoading(false)
    }
  }

  const getProvidersByLocation = async (city: string, state: string, serviceType?: string) => {
    try {
      setLoading(true)
      setError(null)

      const searchParams = new URLSearchParams()
      searchParams.set('city', city)
      searchParams.set('state', state)
      if (serviceType) searchParams.set('service_type', serviceType)
      searchParams.set('verified', 'true')

      const response = await fetch(`/api/providers?${searchParams.toString()}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch providers by location')
      }

      const data = await response.json()
      setProviders(data.providers || [])
    } catch (err) {
      console.error('Error fetching providers by location:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch providers by location')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProviders()
  }, [filters.service_type, filters.city, filters.state, filters.verified])

  return {
    providers,
    loading,
    error,
    fetchProviders,
    createProvider,
    updateProvider,
    searchProviders,
    getProvidersByLocation,
    refetch: fetchProviders
  }
}


