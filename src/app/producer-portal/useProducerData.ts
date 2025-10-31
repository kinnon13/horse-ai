import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { ProducerProfile, ProducerHorse, ProducerEvent } from './types'
import { ProducerDataHelpers } from './useProducerDataHelpers'

export function useProducerData() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<ProducerProfile | null>(null)
  const [horses, setHorses] = useState<ProducerHorse[]>([])
  const [events, setEvents] = useState<ProducerEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      ProducerDataHelpers.loadData(user.id, setProfile, setHorses, setEvents, setLoading)
    } else {
      ProducerDataHelpers.resetData(setProfile, setHorses, setEvents, setLoading)
    }
  }, [user])

  return {
    profile,
    horses,
    events,
    loading,
    refetch: () => ProducerDataHelpers.loadData(user?.id, setProfile, setHorses, setEvents, setLoading)
  }
}