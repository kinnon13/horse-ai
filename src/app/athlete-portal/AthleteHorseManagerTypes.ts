// Athlete Horse Manager Types - Single responsibility
import { CompetitionHorse } from './AthleteHorseTypes'

export interface AthleteHorseManagerSectionProps {
  horses: CompetitionHorse[]
  loading: boolean
  onAddHorse: () => void
  onEditHorse: (horse: CompetitionHorse) => void
  onDeleteHorse: (horseId: string) => void
}