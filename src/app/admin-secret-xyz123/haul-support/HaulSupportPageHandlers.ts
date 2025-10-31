// HaulSupportPageHandlers.ts (25 lines) - Single responsibility: Event handlers
import { useHaulSupportHandlers } from './useHaulSupportHandlers'

export function useHaulSupportPageHandlers(state: any) {
  const {
    points,
    setPoints,
    stats,
    setStats,
    setLoading,
    setShowAddForm,
    setEditingPoint
  } = state

  const handlers = useHaulSupportHandlers({
    points,
    setPoints,
    stats,
    setStats,
    setLoading,
    setShowAddForm,
    setEditingPoint
  })

  return {
    loadData: handlers.loadData,
    handleCreatePoint: handlers.handleCreatePoint,
    handleUpdatePoint: handlers.handleUpdatePoint,
    handleDeletePoint: handlers.handleDeletePoint,
    handleToggleApproval: handlers.handleToggleApproval
  }
}
