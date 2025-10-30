import { Provider, ProviderFilters } from './types'

export const fetchProviders = async (filters: ProviderFilters) => {
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
  return data.providers || []
}

export const createProvider = async (providerData: Omit<Provider, 'id' | 'created_at' | 'updated_at'>) => {
  const response = await fetch('/api/providers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(providerData),
  })

  if (!response.ok) {
    throw new Error('Failed to create provider')
  }

  const data = await response.json()
  return data.provider
}

export const updateProvider = async (id: string, updateData: Partial<Provider>) => {
  const response = await fetch('/api/providers', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...updateData }),
  })

  if (!response.ok) {
    throw new Error('Failed to update provider')
  }

  const data = await response.json()
  return data.provider
}

