import { useEffect } from 'react'
import { MemoryState } from './MemoryTypes'
import { useMemoryState } from './MemoryState'
import { fetchUserMemory, getRecentPerformances, getBreedingHistory } from './MemoryQuery'
import { updateUserMemory, updateUserPreferences, updateTravelPattern, updateLocation } from './MemoryUpdate'
import { generatePersonalityTone, generateMemoryIntroMessage, generateBreedingIntroMessage } from './MemoryPersonalityTone'

export function useUserMemory(userId?: string) {
  const state = useMemoryState()
  const { setUserMemory, setLoading, setError } = state

  const fetchMemory = async () => {
    if (!userId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const memory = await fetchUserMemory(userId)
      setUserMemory(memory)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user memory')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMemory()
  }, [userId])

  return {
    ...state,
    fetchMemory,
    updateUserMemory,
    updateUserPreferences,
    updateTravelPattern,
    updateLocation,
    getRecentPerformances,
    getBreedingHistory,
    generatePersonalityTone,
    generateMemoryIntroMessage,
    generateBreedingIntroMessage
  }
}