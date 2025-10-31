'use client'

import { useState, useEffect } from 'react'

export function usePage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Initialize athlete setup page
    setLoading(false)
  }, [])

  return {
    loading,
    error,
    setError
  }
}

