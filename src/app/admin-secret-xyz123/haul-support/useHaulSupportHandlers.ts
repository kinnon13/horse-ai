import { HaulSupportPoint, HaulSupportStats } from './HaulSupportTypes'
import { loadHaulSupportData } from './HaulSupportOperations'
import {
  handleCreatePoint,
  handleUpdatePoint,
  handleDeletePoint,
  handleToggleApproval,
  CreatePointParams,
  UpdatePointParams,
  DeletePointParams,
  ToggleApprovalParams
} from './HaulSupportActions'

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
  const loadData = async () => {
    await loadHaulSupportData({ setPoints, setStats, setLoading })
  }

  const createPoint = async (formData: any) => {
    await handleCreatePoint({ formData, setPoints, setShowAddForm, loadData })
  }

  const updatePoint = async (pointId: string, updates: any) => {
    await handleUpdatePoint({ pointId, updates, setPoints, setEditingPoint, loadData })
  }

  const deletePoint = async (pointId: string) => {
    await handleDeletePoint({ pointId, setPoints, loadData })
  }

  const toggleApproval = async (pointId: string, approved: boolean) => {
    await handleToggleApproval({ pointId, approved, setPoints, loadData })
  }

  return { loadData, handleCreatePoint: createPoint, handleUpdatePoint: updatePoint, handleDeletePoint: deletePoint, handleToggleApproval: toggleApproval }
}
