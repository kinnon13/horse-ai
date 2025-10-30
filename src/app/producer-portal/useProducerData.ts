import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { ProducerProfile, ProducerHorse, ProducerEvent } from './types'
import { loadProducerData } from './dataLoader'

export function useProducerData() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<ProducerProfile | null>(null)
  const [horses, setHorses] = useState<ProducerHorse[]>([])
  const [events, setEvents] = useState<ProducerEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadData()
    } else {
      setProfile(null)
      setHorses([])
      setEvents([])
      setLoading(false)
    }
  }, [user])

  const loadData = async () => {
    if (!user) return

    try {
      setLoading(true)
      const data = await loadProducerData(user.id)
      setProfile(data.profile)
      setHorses(data.horses)
      setEvents(data.events)
    } catch (error) {
      console.error('Error loading producer data:', error)
    } finally {
      setLoading(false)
    }
  }

  return {
    profile,
    horses,
    events,
    loading,
    refetch: loadData
  }
}



