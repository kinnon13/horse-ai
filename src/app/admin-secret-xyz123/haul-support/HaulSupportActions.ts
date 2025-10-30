import { validateHaulSupportPoint } from './HaulSupportValidator'
import type { CreatePointParams, UpdatePointParams, DeletePointParams, ToggleApprovalParams } from './HaulSupportActionTypes'

export async function handleCreatePoint(params: CreatePointParams) {
  try {
    const { createHaulSupportPoint } = await import('./HaulSupportService')
    const { formData, setPoints, setShowAddForm, loadData } = params
    const validatedData = validateHaulSupportPoint(formData)
    const newPoint = await createHaulSupportPoint(validatedData)
    setPoints(prev => [newPoint, ...prev])
    setShowAddForm(false)
    await loadData()
    alert('Haul support point created successfully!')
  } catch (error) {
    console.error('Error creating haul support point:', error)
    alert('Failed to create haul support point')
  }
}

export async function handleUpdatePoint(params: UpdatePointParams) {
  try {
    const { updateHaulSupportPoint } = await import('./HaulSupportService')
    const { pointId, updates, setPoints, setEditingPoint, loadData } = params
    const updatedPoint = await updateHaulSupportPoint(pointId, updates)
    setPoints(prev => prev.map(p => p.id === pointId ? updatedPoint : p))
    setEditingPoint(null)
    await loadData()
    alert('Haul support point updated successfully!')
  } catch (error) {
    console.error('Error updating haul support point:', error)
    alert('Failed to update haul support point')
  }
}

export async function handleDeletePoint(params: DeletePointParams) {
  const confirmed = confirm('Are you sure you want to delete this haul support point?')
  if (!confirmed) return

  try {
    const { deleteHaulSupportPoint } = await import('./HaulSupportService')
    const { pointId, setPoints, loadData } = params
    await deleteHaulSupportPoint(pointId)
    setPoints(prev => prev.filter(p => p.id !== pointId))
    await loadData()
    alert('Haul support point deleted successfully!')
  } catch (error) {
    console.error('Error deleting haul support point:', error)
    alert('Failed to delete haul support point')
  }
}

export async function handleToggleApproval(params: ToggleApprovalParams) {
  try {
    const { updateHaulSupportPoint } = await import('./HaulSupportService')
    const { pointId, approved, setPoints, loadData } = params
    await updateHaulSupportPoint(pointId, { is_approved: approved })
    setPoints(prev => prev.map(p => p.id === pointId ? { ...p, is_approved: approved } : p))
    await loadData()
    alert(`Haul support point ${approved ? 'approved' : 'unapproved'} successfully!`)
  } catch (error) {
    console.error('Error toggling approval:', error)
    alert('Failed to update approval status')
  }
}