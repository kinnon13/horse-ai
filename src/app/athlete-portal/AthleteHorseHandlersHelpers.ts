// AthleteHorseHandlersHelpers.ts - Helper functions for athlete horse handlers
import { CompetitionHorse } from './AthleteHorseTypes'
import { saveHorse, updateHorse, deleteHorse } from './dataOperations'
import { handleHorseError, confirmHorseDeletion } from './AthleteHorseErrorHandlers'

export async function handleHorseSubmitLogic(
  formData: any,
  editingHorse: CompetitionHorse | null,
  athlete: any,
  setHorses: any,
  setShowHorseForm: (show: boolean) => void,
  setEditingHorse: (horse: CompetitionHorse | null) => void
) {
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
    handleHorseError('saving horse', error)
  }
}

export async function handleDeleteHorseLogic(
  horseId: string,
  setHorses: any
) {
  if (!confirmHorseDeletion()) return
  
  try {
    await deleteHorse(horseId)
    setHorses((prev: CompetitionHorse[]) => prev.filter(h => h.id !== horseId))
  } catch (error) {
    handleHorseError('deleting horse', error)
  }
}

