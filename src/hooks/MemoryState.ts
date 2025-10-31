import { useState } from 'react'
import { MemoryState, UserMemory } from './MemoryTypes'

export function useMemoryState(): MemoryState {
  const [userMemory, setUserMemory] = useState<UserMemory | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  return {
    userMemory,
    loading,
    error,
    setUserMemory,
    setLoading,
    setError
  }
}




