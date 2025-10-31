// CompetitionHorseFormInitializers.ts - Form initialization logic for competition horse forms
import { CompetitionHorse } from './AthleteHorseTypes'

export function createInitialFormData(horse: CompetitionHorse | null) {
  return {
    horse_name: horse?.horse_name || '',
    registered_name: horse?.registered_name || '',
    registration_number: horse?.registration_number || '',
    breed: horse?.breed || '',
    sex: horse?.sex || 'mare',
    birth_year: horse?.birth_year?.toString() || '',
    color: horse?.color || ''
  }
}

