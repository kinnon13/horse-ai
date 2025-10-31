// HaulSupportPageState.ts (25 lines) - Single responsibility: State management
import { useState } from 'react'
import { HaulSupportPoint, HaulSupportStats } from './HaulSupportTypes'

export function useHaulSupportPageState() {
  const [points, setPoints] = useState<HaulSupportPoint[]>([])
  const [stats, setStats] = useState<HaulSupportStats>({
    totalPoints: 0,
    approvedPoints: 0,
    pendingApproval: 0,
    avgSafetyScore: 0,
    totalFeedback: 0
  })
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingPoint, setEditingPoint] = useState<HaulSupportPoint | null>(null)

  return {
    points,
    setPoints,
    stats,
    setStats,
    loading,
    setLoading,
    showAddForm,
    setShowAddForm,
    editingPoint,
    setEditingPoint
  }
}
