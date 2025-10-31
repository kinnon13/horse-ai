import { Dispatch, SetStateAction } from 'react'
import { searchProviders, getProvidersByLocation } from './search'

export const createSearchHandler = (
  setLoading: Dispatch<SetStateAction<boolean>>,
  setError: Dispatch<SetStateAction<string | null>>,
  setProviders: Dispatch<SetStateAction<any[]>>
) => async (query: string, serviceType?: string) => {
  try {
    setLoading(true)
    setError(null)
    const results = await searchProviders(query, serviceType)
    setProviders(results)
  } catch (err) {
    console.error('Error searching providers:', err)
    setError(err instanceof Error ? err.message : 'Failed to search providers')
  } finally {
    setLoading(false)
  }
}

export const createLocationHandler = (
  setLoading: Dispatch<SetStateAction<boolean>>,
  setError: Dispatch<SetStateAction<string | null>>,
  setProviders: Dispatch<SetStateAction<any[]>>
) => async (city: string, state: string, serviceType?: string) => {
  try {
    setLoading(true)
    setError(null)
    const data = await getProvidersByLocation(city, state, serviceType)
    setProviders(data)
  } catch (err) {
    console.error('Error fetching providers by location:', err)
    setError(err instanceof Error ? err.message : 'Failed to fetch providers by location')
  } finally {
    setLoading(false)
  }
}


