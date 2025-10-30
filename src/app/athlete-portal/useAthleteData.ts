import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import { loadAthleteData } from './dataLoader'
import { AthleteProfile, CompetitionHorse, CompetitionEvent, ServiceRequest } from './types'

export function useAthleteData() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [athlete, setAthlete] = useState<AthleteProfile | null>(null)
  const [horses, setHorses] = useState<CompetitionHorse[]>([])
  const [events, setEvents] = useState<CompetitionEvent[]>([])
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([])
  const [loadingProfile, setLoadingProfile] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin')
      return
    }
    if (user) {
      loadData()
    }
  }, [user, loading, router])

  const loadData = async () => {
    if (!user) return
    setLoadingProfile(true)
    const data = await loadAthleteData(user.id)
    if (data) {
      setAthlete(data.athlete)
      setHorses(data.horses)
      setEvents(data.events)
      setServiceRequests(data.serviceRequests)
    }
    setLoadingProfile(false)
  }

  return {
    athlete,
    horses,
    events,
    serviceRequests,
    loadingProfile,
    setHorses,
    setEvents
  }
}

