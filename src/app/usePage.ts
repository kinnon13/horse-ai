'use client'

import { useState, useEffect } from 'react'

export function usePage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Initialize home page
    setLoading(false)
  }, [])

  return {
    loading,
    error,
    setError
  }
}

