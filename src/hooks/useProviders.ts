// Database: transaction handling
import { useState, useEffect } from 'react'
import { ProviderFilters } from './useProviders/types'
import { createFetchHandler } from './useProviders/fetchHandlers'
import { createCreateHandler, createUpdateHandler } from './useProviders/mutateHandlers'
import { createSearchHandler, createLocationHandler } from './useProviders/searchHandlers'

export function useProviders(filters: ProviderFilters = {}) {
  const [providers, setProviders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProvidersData = createFetchHandler(setLoading, setError, setProviders, filters)
  const createProviderData = createCreateHandler(setProviders)
  const updateProviderData = createUpdateHandler(setProviders)
  const searchProvidersData = createSearchHandler(setLoading, setError, setProviders)
  const getProvidersByLocationData = createLocationHandler(setLoading, setError, setProviders)

  useEffect(() => {
    fetchProvidersData()
  }, [filters.service_type, filters.city, filters.state, filters.verified])

  return {
    providers,
    loading,
    error,
    fetchProviders: fetchProvidersData,
    createProvider: createProviderData,
    updateProvider: updateProviderData,
    searchProviders: searchProvidersData,
    getProvidersByLocation: getProvidersByLocationData,
    refetch: fetchProvidersData
  }
}
