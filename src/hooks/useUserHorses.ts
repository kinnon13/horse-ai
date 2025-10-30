import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { fetchUserHorses } from './useUserHorsesRepo'
import { addUserHorse } from './useUserHorsesOperations'

interface Horse {
  id: string
  name: string
  sex: 'mare' | 'stud' | 'gelding' | 'filly' | 'colt' | 'unknown'
  year: string | null
  location_city: string | null
  location_state: string | null
}

export function useUserHorses() {
  const { user } = useAuth()
  const [horses, setHorses] = useState<Horse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchHorses()
    } else {
      setHorses([])
      setLoading(false)
    }
  }, [user])

  const fetchHorses = async () => {
    if (!user) return

    try {
      const data = await fetchUserHorses(user.id)
      setHorses(data)
    } catch (error) {
      console.error('Error fetching horses:', error)
      setHorses([])
    } finally {
      setLoading(false)
    }
  }

  const addHorse = async (horseData: Omit<Horse, 'id'>) => {
    if (!user) return false

    try {
      const data = await addUserHorse(user.id, horseData)
      if (data) {
        setHorses(prev => [data, ...prev])
        return true
      }
      return false
    } catch (error) {
      console.error('Error adding horse:', error)
      return false
    }
  }

  return { horses, loading, refetch: fetchHorses, addHorse }
}