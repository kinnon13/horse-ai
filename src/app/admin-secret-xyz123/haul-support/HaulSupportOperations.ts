import { HaulSupportPoint, HaulSupportStats } from './HaulSupportTypes'

export interface LoadDataParams {
  setPoints: (points: HaulSupportPoint[]) => void
  setStats: (stats: HaulSupportStats) => void
  setLoading: (loading: boolean) => void
}

export async function loadHaulSupportData({
  setPoints,
  setStats,
  setLoading
}: LoadDataParams) {
  try {
    setLoading(true)
    const { fetchHaulSupportPoints, fetchHaulSupportStats } = await import('./HaulSupportService')
    const [pointsData, statsData] = await Promise.all([
      fetchHaulSupportPoints(),
      fetchHaulSupportStats()
    ])
    setPoints(pointsData)
    setStats(statsData)
  } catch (error) {
    console.error('Error loading haul support data:', error)
    throw error
  } finally {
    setLoading(false)
  }
}

