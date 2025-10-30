import { useState } from 'react'
import { StallionProfile } from './types'
import { saveStallion, updateStallion, deleteStallion } from './dataOperations'

export function useStallionHandlers(station: any, setStallions: any) {
  const [showStallionForm, setShowStallionForm] = useState(false)
  const [editingStallion, setEditingStallion] = useState<StallionProfile | null>(null)

  const handleStallionSubmit = async (formData: any) => {
    if (!station) return
    
    try {
      if (editingStallion) {
        await updateStallion({ ...editingStallion, ...formData })
        setStallions((prev: StallionProfile[]) => 
          prev.map(s => s.id === editingStallion.id ? { ...s, ...formData } : s)
        )
      } else {
        const data = await saveStallion(formData, station.id)
        setStallions((prev: StallionProfile[]) => [...prev, data])
      }
      
      setShowStallionForm(false)
      setEditingStallion(null)
    } catch (error) {
      console.error('Error saving stallion:', error)
    }
  }

  const handleDeleteStallion = async (stallionId: string) => {
    if (!confirm('Are you sure you want to delete this stallion?')) return
    
    try {
      await deleteStallion(stallionId)
      setStallions((prev: StallionProfile[]) => prev.filter(s => s.id !== stallionId))
    } catch (error) {
      console.error('Error deleting stallion:', error)
    }
  }

  const handleEditStallion = (stallion: StallionProfile) => {
    setEditingStallion(stallion)
    setShowStallionForm(true)
  }

  const handleAddStallion = () => {
    setEditingStallion(null)
    setShowStallionForm(true)
  }

  return {
    showStallionForm,
    editingStallion,
    handleStallionSubmit,
    handleDeleteStallion,
    handleEditStallion,
    handleAddStallion,
    setShowStallionForm,
    setEditingStallion
  }
}

