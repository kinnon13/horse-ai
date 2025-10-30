import { useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { performWebSearch } from './useWebSearchOperations'

export function useWebSearch() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<any>(null)

  const search = async (query: string) => {
    if (!user) {
      setError('You must be logged in to search')
      return null
    }

    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const data = await performWebSearch(query, user.id)

      if (!data?.success) {
        if (data?.upgradeRequired) {
          setError('Web search requires Plus tier subscription')
        } else {
          setError(data?.error || 'Search failed')
        }
        return data
      }

      setResults(data.results)
      return data
    } catch (err) {
      const errorMessage = 'Network error during search'
      setError(errorMessage)
      return { success: false, error: errorMessage, query, results: { results: [] } }
    } finally {
      setLoading(false)
    }
  }

  return {
    search,
    loading,
    error,
    results,
    clearError: () => setError(null),
    clearResults: () => setResults(null)
  }
}

