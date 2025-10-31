// useDebouncedSearch.ts (25 lines) - Main debounced search hook
'use client'

import { useDebouncedSearchState } from './useDebouncedSearchState'
import { useDebouncedSearchLogic } from './useDebouncedSearchLogic'

export function useDebouncedSearch<T>(
  searchFunction: (query: string) => Promise<T[]>,
  delay: number = 300
) {
  const {
    query,
    setQuery,
    results,
    setResults,
    loading,
    setLoading,
    error,
    setError,
    clearSearch
  } = useDebouncedSearchState<T>()

  useDebouncedSearchLogic(
    searchFunction,
    delay,
    query,
    setResults,
    setLoading,
    setError
  )

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    clearSearch
  }
}