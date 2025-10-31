import { HorseProfile } from './types'
import { saveHorse, updateHorse, deleteHorse } from './dataOperations'

export const createHorseSubmit = (editingHorse: HorseProfile | null, setHorses: any, setShowHorseForm: any, setEditingHorse: any, owner: any) => 
  async (formData: any) => {
    if (!owner) return
    try {
      if (editingHorse) {
        await updateHorse(editingHorse.id, { ...editingHorse, ...formData })
        setHorses((prev: HorseProfile[]) => prev.map(h => h.id === editingHorse.id ? { ...h, ...formData } : h))
      } else {
        const data = await saveHorse(formData)
        setHorses((prev: HorseProfile[]) => [...prev, data])
      }
      setShowHorseForm(false)
      setEditingHorse(null)
    } catch (error) {
      console.error('Error saving horse:', error)
    }
  }

export const createDeleteHandler = (setHorses: any) => async (horseId: string) => {
  if (!confirm('Are you sure you want to delete this horse?')) return
  try {
    await deleteHorse(horseId)
    setHorses((prev: HorseProfile[]) => prev.filter(h => h.id !== horseId))
  } catch (error) {
    console.error('Error deleting horse:', error)
  }
}

