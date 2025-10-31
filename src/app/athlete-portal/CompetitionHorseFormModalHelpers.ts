// CompetitionHorseFormModalHelpers.ts - Helper functions for competition horse form modal
import { CompetitionHorse } from './AthleteHorseTypes'

export function createHorseData(formData: any): CompetitionHorse {
  return {
    id: '',
    athlete_id: '',
    horse_name: formData.horse_name,
    registered_name: formData.registered_name,
    registration_number: formData.registration_number,
    breed: formData.breed,
    color: formData.color,
    sex: formData.sex,
    birth_year: formData.birth_year ? parseInt(formData.birth_year) : 0,
    sire: '',
    dam: '',
    owner_name: '',
    owner_phone: '',
    owner_email: '',
    location_city: '',
    location_state: '',
    value: 0,
    notes: '',
    created_at: '',
    updated_at: '',
    performance_summary: '',
    recent_results: '',
    breeding_potential: '',
    health_status: '',
    training_level: '',
    competition_level: '',
    last_competition: '',
    next_competition: '',
    achievements: '',
    bloodline_notes: ''
  }
}