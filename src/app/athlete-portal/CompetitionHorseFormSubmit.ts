import { CompetitionHorse } from './AthleteHorseTypes'
import { CompetitionHorseFormData } from './CompetitionHorseFormTypes'

export function buildHorseFromForm(horse: CompetitionHorse | null, formData: CompetitionHorseFormData): CompetitionHorse {
  return {
    id: horse?.id || '',
    athlete_id: horse?.athlete_id || '',
    horse_name: formData.name,
    registered_name: '',
    registration_number: formData.registration_number,
    breed: formData.breed,
    color: formData.color,
    sex: formData.gender,
    birth_year: parseInt(formData.age) || 0,
    sire: '',
    dam: '',
    owner_name: '',
    owner_phone: '',
    owner_email: '',
    location_city: '',
    location_state: '',
    value: 0,
    notes: '',
    created_at: horse?.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
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


