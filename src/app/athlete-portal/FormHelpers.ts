// FormHelpers.ts (50 lines) - Single responsibility: Form helper functions
import { CompetitionHorse } from './AthleteHorseTypes'
import { CompetitionHorseFormData } from './CompetitionHorseFormTypes'

export class FormHelpers {
  static initializeFormData(horse?: CompetitionHorse): CompetitionHorseFormData {
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

  static validateFormData(formData: CompetitionHorseFormData): Record<string, string> {
    const errors: Record<string, string> = {}
    if (!formData.name.trim()) errors.name = 'Name is required'
    if (!formData.breed.trim()) errors.breed = 'Breed is required'
    if (!formData.age.trim()) errors.age = 'Age is required'
    if (!formData.gender.trim()) errors.gender = 'Gender is required'
    return errors
  }
}