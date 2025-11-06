// TODO: Add try-catch - wrap async operations for production
import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import { loadStationData } from './dataLoader'
import { StallionProfile } from './StallionProfileTypes'

export function useStallionData() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [station, setStation] = useState<StallionProfile | null>(null)
  const [stallions, setStallions] = useState<StallionProfile[]>([])
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
    const data = await loadStationData(user.id)
    if (data) {
      setStation(data.station)
      setStallions(data.stallions)
    }
    setLoadingProfile(false)
  }

  return {
    station,
    stallions,
    loadingProfile,
    setStallions
  }
}




