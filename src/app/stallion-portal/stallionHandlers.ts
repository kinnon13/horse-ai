import { StallionProfile } from './types'
import { saveStallion, updateStallion, deleteStallion } from './dataOperations'

export const createStallionSubmit = (editingStallion: StallionProfile | null, setStallions: any, setShowStallionForm: any, setEditingStallion: any, station: any) => 
  async (formData: any) => {
    if (!station) return
    try {
      if (editingStallion) {
        await updateStallion(editingStallion.id, { ...editingStallion, ...formData })
        setStallions((prev: StallionProfile[]) => prev.map(s => s.id === editingStallion.id ? { ...s, ...formData } : s))
      } else {
        const data = await saveStallion(formData)
        setStallions((prev: StallionProfile[]) => [...prev, data])
      }
      setShowStallionForm(false)
      setEditingStallion(null)
    } catch (error) {
      console.error('Error saving stallion:', error)
    }
  }

export const createDeleteHandler = (setStallions: any) => async (stallionId: string) => {
  if (!confirm('Are you sure you want to delete this stallion?')) return
  try {
    await deleteStallion(stallionId)
    setStallions((prev: StallionProfile[]) => prev.filter(s => s.id !== stallionId))
  } catch (error) {
    console.error('Error deleting stallion:', error)
  }
}

