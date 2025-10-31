// AthleteDataLoader.ts (35 lines) - Main data loading hook
import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import { AthleteDataState, loadAthleteDataHelper } from './AthleteDataLoaderHelpers'
import { CompetitionHorse } from './AthleteHorseTypes'
import { CompetitionEvent } from './AthleteEventTypes'

export function useAthleteDataLoader() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [athlete, setAthlete] = useState<AthleteDataState['athlete']>(null)
  const [horses, setHorses] = useState<CompetitionHorse[]>([])
  const [events, setEvents] = useState<CompetitionEvent[]>([])
  const [serviceRequests, setServiceRequests] = useState<AthleteDataState['serviceRequests']>([])
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
    const data = await loadAthleteDataHelper(user.id)
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