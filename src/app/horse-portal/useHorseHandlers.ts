import { useState } from 'react'
import { HorseProfile } from './types'
import { saveHorse, updateHorse, deleteHorse } from './dataOperations'

export function useHorseHandlers(owner: any, setHorses: any) {
  const [showHorseForm, setShowHorseForm] = useState(false)
  const [editingHorse, setEditingHorse] = useState<HorseProfile | null>(null)

  const handleHorseSubmit = async (formData: any) => {
    if (!owner) return
    
    try {
      if (editingHorse) {
        await updateHorse({ ...editingHorse, ...formData })
        setHorses((prev: HorseProfile[]) => 
          prev.map(h => h.id === editingHorse.id ? { ...h, ...formData } : h)
        )
      } else {
        const data = await saveHorse(formData, owner.id)
        setHorses((prev: HorseProfile[]) => [...prev, data])
      }
      
      setShowHorseForm(false)
      setEditingHorse(null)
    } catch (error) {
      console.error('Error saving horse:', error)
    }
  }

  const handleDeleteHorse = async (horseId: string) => {
    if (!confirm('Are you sure you want to delete this horse?')) return
    
    try {
      await deleteHorse(horseId)
      setHorses((prev: HorseProfile[]) => prev.filter(h => h.id !== horseId))
    } catch (error) {
      console.error('Error deleting horse:', error)
    }
  }

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

