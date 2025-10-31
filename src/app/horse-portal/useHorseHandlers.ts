import { useState } from 'react'
import { HorseProfile } from './types'
import { createHorseSubmit, createDeleteHandler } from './horseHandlers'

export function useHorseHandlers(owner: any, setHorses: any) {
  const [showHorseForm, setShowHorseForm] = useState(false)
  const [editingHorse, setEditingHorse] = useState<HorseProfile | null>(null)

  const handleHorseSubmit = createHorseSubmit(editingHorse, setHorses, setShowHorseForm, setEditingHorse, owner)
  const handleDeleteHorse = createDeleteHandler(setHorses)

  const handleEditHorse = (horse: HorseProfile) => {
    setEditingHorse(horse)
    setShowHorseForm(true)
  }

  const handleAddHorse = () => {
    setEditingHorse(null)
    setShowHorseForm(true)
  }

  return {
    showHorseForm,
    editingHorse,
    handleHorseSubmit,
    handleDeleteHorse,
    handleEditHorse,
    handleAddHorse,
    setShowHorseForm,
    setEditingHorse
  }
}
