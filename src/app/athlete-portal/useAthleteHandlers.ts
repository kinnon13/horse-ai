import { useState } from 'react'
import { CompetitionHorse, CompetitionEvent } from './types'
import { saveHorse, updateHorse, deleteHorse, deleteEvent } from './dataOperations'

export function useAthleteHandlers(athlete: any, setHorses: any, setEvents: any) {
  const [showHorseForm, setShowHorseForm] = useState(false)
  const [showEventForm, setShowEventForm] = useState(false)
  const [showServiceRequestForm, setShowServiceRequestForm] = useState(false)
  const [editingHorse, setEditingHorse] = useState<CompetitionHorse | null>(null)
  const [editingEvent, setEditingEvent] = useState<CompetitionEvent | null>(null)

  const handleHorseSubmit = async (formData: any) => {
    if (!athlete) return
    
    try {
      if (editingHorse) {
        await updateHorse({ ...editingHorse, ...formData })
        setHorses((prev: CompetitionHorse[]) => 
          prev.map(h => h.id === editingHorse.id ? { ...h, ...formData } : h)
        )
      } else {
        const data = await saveHorse(formData, athlete.id)
        setHorses((prev: CompetitionHorse[]) => [...prev, data])
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
      setHorses((prev: CompetitionHorse[]) => prev.filter(h => h.id !== horseId))
    } catch (error) {
      console.error('Error deleting horse:', error)
    }
  }

  const handleEditHorse = (horse: CompetitionHorse) => {
    setEditingHorse(horse)
    setShowHorseForm(true)
  }

  const handleAddHorse = () => {
    setEditingHorse(null)
    setShowHorseForm(true)
  }

  const handleAddEvent = () => {
    setEditingEvent(null)
    setShowEventForm(true)
  }

  const handleEditEvent = (event: CompetitionEvent) => {
    setEditingEvent(event)
    setShowEventForm(true)
  }

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return
    
    try {
      await deleteEvent(eventId)
      setEvents((prev: CompetitionEvent[]) => prev.filter(e => e.id !== eventId))
    } catch (error) {
      console.error('Error deleting event:', error)
    }
  }

  return {
    showHorseForm,
    showEventForm,
    showServiceRequestForm,
    editingHorse,
    editingEvent,
    handleHorseSubmit,
    handleDeleteHorse,
    handleEditHorse,
    handleAddHorse,
    handleAddEvent,
    handleEditEvent,
    handleDeleteEvent,
    setShowHorseForm,
    setEditingHorse
  }
}

