import { HaulSupportForm } from './HaulSupportForm'
import { HaulSupportPoint } from './HaulSupportTypes'

interface HaulSupportFormModalProps {
  showAddForm: boolean
  editingPoint: HaulSupportPoint | null
  onClose: () => void
  onCreatePoint: (data: any) => void
  onUpdatePoint: (pointId: string, data: any) => void
}

export function HaulSupportFormModal({ 
  showAddForm, 
  editingPoint, 
  onClose, 
  onCreatePoint, 
  onUpdatePoint 
}: HaulSupportFormModalProps) {
  if (!showAddForm && !editingPoint) return null

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        {editingPoint ? 'Edit Haul Support Point' : 'Add New Haul Support Point'}
      </h2>
      <HaulSupportForm
        onSubmit={editingPoint ? (data) => onUpdatePoint(editingPoint.id, data) : onCreatePoint}
        onCancel={onClose}
        initialData={editingPoint}
      />
    </div>
  )
}

