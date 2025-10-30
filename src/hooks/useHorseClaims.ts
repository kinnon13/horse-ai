import { useState, useEffect } from 'react'
import type { HorseClaim, ClaimFilters } from './useHorseClaimsTypes'

export function useHorseClaims(filters: ClaimFilters = {}) {
  const [claims, setClaims] = useState<HorseClaim[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchClaims = async () => {
    try {
      setLoading(true)
      setError(null)
      const searchParams = new URLSearchParams()
      if (filters.user_id) searchParams.set('user_id', filters.user_id)
      if (filters.horse_id) searchParams.set('horse_id', filters.horse_id)
      if (filters.status) searchParams.set('status', filters.status)
      if (filters.limit) searchParams.set('limit', filters.limit.toString())
      const response = await fetch(`/api/claim?${searchParams.toString()}`)
      if (!response.ok) throw new Error('Failed to fetch horse claims')
      const data = await response.json()
      setClaims(data.claims || [])
    } catch (err) {
      console.error('Error fetching horse claims:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch horse claims')
    } finally {
      setLoading(false)
    }
  }

  const createClaim = async (claimData: Omit<HorseClaim, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const response = await fetch('/api/claim', {method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(claimData),
      })
      if (!response.ok) throw new Error('Failed to create horse claim')
      const data = await response.json()
      setClaims(prev => [data.claim, ...prev])
      return data.claim
    } catch (err) {
      console.error('Error creating horse claim:', err)
      throw err
    }
  }

  const updateClaim = async (id: string, updateData: Partial<HorseClaim>) => {
    try {
      const response = await fetch('/api/claim', {method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updateData }),
      })
      if (!response.ok) throw new Error('Failed to update horse claim')
      const data = await response.json()
      setClaims(prev => prev.map(claim => claim.id === id ? data.claim : claim))
      return data.claim
    } catch (err) {
      console.error('Error updating horse claim:', err)
      throw err
    }
  }

  useEffect(() => {
    fetchClaims()
  }, [filters.user_id, filters.horse_id, filters.status])

  return { claims, loading, error, fetchClaims, createClaim, updateClaim, refetch: fetchClaims }
}
