import { Provider, ProviderFilters } from './types'

export const searchProviders = async (query: string, serviceType?: string) => {
  const searchParams = new URLSearchParams()
  if (query) searchParams.set('city', query)
  if (serviceType) searchParams.set('service_type', serviceType)
  searchParams.set('verified', 'true')

  const response = await fetch(`/api/providers?${searchParams.toString()}`)
  
  if (!response.ok) {
    throw new Error('Failed to search providers')
  }

  const data = await response.json()
  
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
  
  return filteredProviders
}

export const getProvidersByLocation = async (city: string, state: string, serviceType?: string) => {
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
  return data.providers || []
}


