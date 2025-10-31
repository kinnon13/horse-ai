import { useState } from 'react'
import { StallionProfile } from './StallionProfileTypes'
import { createStallionSubmit, createDeleteHandler } from './stallionHandlers'

export function useStallionHandlers(station: any, setStallions: any) {
  const [showStallionForm, setShowStallionForm] = useState(false)
  const [editingStallion, setEditingStallion] = useState<StallionProfile | null>(null)

  const handleStallionSubmit = createStallionSubmit(editingStallion, setStallions, setShowStallionForm, setEditingStallion, station)
  const handleDeleteStallion = createDeleteHandler(setStallions)

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
