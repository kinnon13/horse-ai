import { Dispatch, SetStateAction } from 'react'
import { Provider } from './types'
import { fetchProviders } from './operations'

export const createFetchHandler = (
  setLoading: Dispatch<SetStateAction<boolean>>,
  setError: Dispatch<SetStateAction<string | null>>,
  setProviders: Dispatch<SetStateAction<Provider[]>>,
  filters: any
) => async () => {
  try {
    setLoading(true)
    setError(null)
    const data = await fetchProviders(filters)
    setProviders(data)
  } catch (err) {
    console.error('Error fetching providers:', err)
    setError(err instanceof Error ? err.message : 'Failed to fetch providers')
  } finally {
    setLoading(false)
  }
}


