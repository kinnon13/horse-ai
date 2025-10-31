import { HaulSupportPoint, HaulSupportStats } from './HaulSupportTypes'
import { createHaulSupportHandlers } from './HaulSupportHandlerFactory'

interface UseHaulSupportHandlersProps {
  points: HaulSupportPoint[]
  setPoints: (points: HaulSupportPoint[]) => void
  stats: HaulSupportStats
  setStats: (stats: HaulSupportStats) => void
  setLoading: (loading: boolean) => void
  setShowAddForm: (show: boolean) => void
  setEditingPoint: (point: HaulSupportPoint | null) => void
}

export function useHaulSupportHandlers({
  setPoints,
  setStats,
  setLoading,
  setShowAddForm,
  setEditingPoint
}: UseHaulSupportHandlersProps) {
  return createHaulSupportHandlers({
    setPoints,
    setStats,
    setLoading,
    setShowAddForm,
    setEditingPoint
  })
}
