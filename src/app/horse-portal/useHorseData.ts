// Horse Data Hook - Single responsibility
import { useState, useEffect } from 'react'
import { loadHorseData } from './dataLoader'
import { HorseProfile } from './types'

export function useHorseData(horseId: string) {
  const [horse, setHorse] = useState<HorseProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchHorse() {
      try {
        setLoading(true)
        const data = await loadHorseData(horseId)
        setHorse(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load horse data')
      } finally {
        setLoading(false)
      }
    }

    if (horseId) {
      fetchHorse()
    }
  }, [horseId])

  return { horse, loading, error }
}