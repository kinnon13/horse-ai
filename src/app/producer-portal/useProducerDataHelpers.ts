import { ProducerProfile, ProducerHorse, ProducerEvent } from './types'
import { loadProducerData } from './dataLoader'

export class ProducerDataHelpers {
  static async loadData(
    userId: string | undefined,
    setProfile: (profile: ProducerProfile | null) => void,
    setHorses: (horses: ProducerHorse[]) => void,
    setEvents: (events: ProducerEvent[]) => void,
    setLoading: (loading: boolean) => void
  ) {
    if (!userId) return

    try {
      setLoading(true)
      const data = await loadProducerData(userId)
      setProfile(data.profile)
      setHorses(data.horses)
      setEvents(data.events)
    } catch (error) {
      console.error('Error loading producer data:', error)
    } finally {
      setLoading(false)
    }
  }

  static resetData(
    setProfile: (profile: ProducerProfile | null) => void,
    setHorses: (horses: ProducerHorse[]) => void,
    setEvents: (events: ProducerEvent[]) => void,
    setLoading: (loading: boolean) => void
  ) {
    setProfile(null)
    setHorses([])
    setEvents([])
    setLoading(false)
  }
}

