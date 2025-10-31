// useDebouncedSearchState.ts (25 lines) - State management for debounced search
'use client'

import { useState } from 'react'

export function useDebouncedSearchState<T>() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearSearch = () => {
    setQuery('')
    setResults([])
    setError(null)
  }

  return {
    query,
    setQuery,
    results,
    setResults,
    loading,
    setLoading,
    error,
    setError,
    clearSearch
  }
}

