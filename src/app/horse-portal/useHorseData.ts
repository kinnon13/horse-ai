import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import { loadOwnerData } from './dataLoader'
import { HorseOwnerProfile, HorseProfile } from './types'

export function useHorseData() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [owner, setOwner] = useState<HorseOwnerProfile | null>(null)
  const [horses, setHorses] = useState<HorseProfile[]>([])
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
    const data = await loadOwnerData(user.id)
    if (data) {
      setOwner(data.owner)
      setHorses(data.horses)
    }
    setLoadingProfile(false)
  }

  return {
    owner,
    horses,
    loadingProfile,
    setHorses
  }
}

