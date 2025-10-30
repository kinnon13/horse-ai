import { useState, useEffect } from 'react'
import { HaulSupportPoint, HaulSupportStats } from './HaulSupportTypes'
import { HaulSupportStatsCards } from './HaulSupportStatsCards'
import { HaulSupportPageHeader } from './HaulSupportPageHeader'
import { HaulSupportPageLoading } from './HaulSupportPageLoading'
import { HaulSupportFormModal } from './HaulSupportFormModal'
import { HaulSupportPointsList } from './HaulSupportPointsList'
import { useHaulSupportHandlers } from './useHaulSupportHandlers'

export function HaulSupportPageContent() {
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

  const handlers = useHaulSupportHandlers({
    points,
    setPoints,
    stats,
    setStats,
    setLoading,
    setShowAddForm,
    setEditingPoint
  })

  useEffect(() => {
    handlers.loadData()
  }, [])

  if (loading) return <HaulSupportPageLoading />

  return (
    <div className="min-h-screen bg-gray-50">
      <HaulSupportPageHeader onAddPoint={() => setShowAddForm(true)} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <HaulSupportStatsCards stats={stats} />

        <HaulSupportFormModal
          showAddForm={showAddForm}
          editingPoint={editingPoint}
          onClose={() => {
            setShowAddForm(false)
            setEditingPoint(null)
          }}
          onCreatePoint={handlers.handleCreatePoint}
          onUpdatePoint={handlers.handleUpdatePoint}
        />

        <HaulSupportPointsList
          points={points}
          onEditPoint={setEditingPoint}
          onDeletePoint={handlers.handleDeletePoint}
          onToggleApproval={handlers.handleToggleApproval}
        />
      </div>
    </div>
  )
}