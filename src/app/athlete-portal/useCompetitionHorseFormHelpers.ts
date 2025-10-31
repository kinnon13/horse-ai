// useCompetitionHorseFormHelpers.ts (30 lines) - Single responsibility: Form helper functions
import { CompetitionHorse } from './AthleteHorseTypes'
import { CompetitionHorseFormData } from './CompetitionHorseFormTypes'

export class UseCompetitionHorseFormHelpers {
  static createInitialFormData(horse?: CompetitionHorse): CompetitionHorseFormData {
    return {
      name: horse?.horse_name || '',
      breed: horse?.breed || '',
      age: horse?.birth_year?.toString() || '',
      gender: horse?.sex || '',
      color: horse?.color || '',
      height: '',
      weight: '',
      registration_number: horse?.registration_number || '',
      owner_name: horse?.owner_name || '',
      owner_phone: horse?.owner_phone || '',
      owner_email: horse?.owner_email || '',
      trainer_name: '',
      trainer_phone: '',
      trainer_email: '',
      notes: horse?.notes || '',
    }
  }

  static createFormState() {
    return {
      errors: {} as Record<string, string>,
      isSubmitting: false
    }
  }
}