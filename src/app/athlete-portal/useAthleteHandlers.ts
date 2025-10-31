// useAthleteHandlers.ts (40 lines) - Single responsibility: Main athlete handlers hook
import { useState } from 'react'
import { CompetitionHorse } from './Types'
import { CompetitionEvent } from './AthleteEventTypes'
import { AthleteHorseHandlers } from './AthleteHorseHandlers'
import { AthleteEventHandlers } from './AthleteEventHandlers'

export function useAthleteHandlers(athlete: any, setHorses: any, setEvents: any) {
  const [showHorseForm, setShowHorseForm] = useState(false)
  const [showEventForm, setShowEventForm] = useState(false)
  const [showServiceRequestForm, setShowServiceRequestForm] = useState(false)
  const [editingHorse, setEditingHorse] = useState<CompetitionHorse | null>(null)
  const [editingEvent, setEditingEvent] = useState<CompetitionEvent | null>(null)

  const horseHandlers = new AthleteHorseHandlers(
    athlete, setHorses, setShowHorseForm, setEditingHorse
  )
  
  const eventHandlers = new AthleteEventHandlers(
    setEvents, setShowEventForm, setEditingEvent
  )

  return {
    showHorseForm,
    showEventForm,
    showServiceRequestForm,
    editingHorse,
    editingEvent,
    handleHorseSubmit: (formData: any) => horseHandlers.handleHorseSubmit(formData, editingHorse),
    handleDeleteHorse: horseHandlers.handleDeleteHorse,
    handleEditHorse: horseHandlers.handleEditHorse,
    handleAddHorse: () => setShowHorseForm(true),
    handleAddEvent: eventHandlers.handleAddEvent,
    handleEditEvent: eventHandlers.handleEditEvent,
    handleDeleteEvent: eventHandlers.handleDeleteEvent,
    setShowHorseForm,
    setEditingHorse
  }
}