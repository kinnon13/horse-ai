// useDebouncedSearchLogic.ts (25 lines) - Search logic for debounced search
'use client'

import { useCallback, useEffect } from 'react'

export function useDebouncedSearchLogic<T>(
  searchFunction: (query: string) => Promise<T[]>,
  delay: number,
  query: string,
  setResults: (results: T[]) => void,
  setLoading: (loading: boolean) => void,
  setError: (error: string | null) => void
) {
  const debouncedSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([])
        return
      }

      setLoading(true)
      setError(null)

      try {
        const searchResults = await searchFunction(searchQuery)
        setResults(searchResults)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed')
        setResults([])
      } finally {
        setLoading(false)
      }
    },
    [searchFunction, setResults, setLoading, setError]
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      debouncedSearch(query)
    }, delay)

    return () => clearTimeout(timer)
  }, [query, debouncedSearch, delay])
}

