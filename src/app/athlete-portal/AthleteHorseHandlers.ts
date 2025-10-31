// AthleteHorseHandlers.ts - Single responsibility: Horse CRUD handlers
import { CompetitionHorse } from './AthleteHorseTypes'
import { handleHorseSubmitLogic, handleDeleteHorseLogic } from './AthleteHorseHandlersHelpers'

export class AthleteHorseHandlers {
  constructor(
    private athlete: any,
    private setHorses: any,
    private setShowHorseForm: (show: boolean) => void,
    private setEditingHorse: (horse: CompetitionHorse | null) => void
  ) {}

  handleHorseSubmit = async (formData: any, editingHorse: CompetitionHorse | null) => {
    await handleHorseSubmitLogic(
      formData,
      editingHorse,
      this.athlete,
      this.setHorses,
      this.setShowHorseForm,
      this.setEditingHorse
    )
  }

  handleDeleteHorse = async (horseId: string) => {
    await handleDeleteHorseLogic(horseId, this.setHorses)
  }

  handleEditHorse = (horse: CompetitionHorse) => {
    this.setEditingHorse(horse)
    this.setShowHorseForm(true)
  }
}

