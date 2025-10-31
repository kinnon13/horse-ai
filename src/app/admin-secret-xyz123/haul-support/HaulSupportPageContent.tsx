// HaulSupportPageContent.tsx (40 lines) - Single responsibility: Main page component
import { useEffect } from 'react'
import { HaulSupportStatsCards } from './HaulSupportStatsCards'
import { HaulSupportPageHeader } from './HaulSupportPageHeader'
import { HaulSupportPageLoading } from './HaulSupportPageLoading'
import { HaulSupportFormModal } from './HaulSupportFormModal'
import { HaulSupportPointsList } from './HaulSupportPointsList'
import { useHaulSupportPageState } from './HaulSupportPageState'
import { useHaulSupportPageHandlers } from './HaulSupportPageHandlers'

export function HaulSupportPageContent() {
  const state = useHaulSupportPageState()
  const handlers = useHaulSupportPageHandlers(state)

  useEffect(() => {
    handlers.loadData()
  }, [])

  if (state.loading) return <HaulSupportPageLoading />

  return (
    <div className="min-h-screen bg-gray-50">
      <HaulSupportPageHeader onAddPoint={() => state.setShowAddForm(true)} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <HaulSupportStatsCards stats={state.stats} />

        <HaulSupportFormModal
          showAddForm={state.showAddForm}
          editingPoint={state.editingPoint}
          onClose={() => {
            state.setShowAddForm(false)
            state.setEditingPoint(null)
          }}
          onCreatePoint={handlers.handleCreatePoint}
          onUpdatePoint={handlers.handleUpdatePoint}
        />

        <HaulSupportPointsList
          points={state.points}
          onEditPoint={state.setEditingPoint}
          onDeletePoint={handlers.handleDeletePoint}
          onToggleApproval={handlers.handleToggleApproval}
        />
      </div>
    </div>
  )
}