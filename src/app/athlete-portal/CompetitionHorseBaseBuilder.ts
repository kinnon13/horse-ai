// CompetitionHorseBaseBuilder.ts (30 lines) - Base horse data builder
import { CompetitionHorse } from './AthleteHorseTypes'

export class CompetitionHorseBaseBuilder {
  static createBaseHorse(): CompetitionHorse {
    return {
      id: '',
      athlete_id: '',
      horse_name: '',
      registered_name: '',
      registration_number: '',
      breed: '',
      color: '',
      sex: '',
      birth_year: 0,
      sire: '',
      dam: '',
      owner_name: '',
      owner_phone: '',
      owner_email: '',
      location_city: '',
      location_state: '',
      value: 0,
      notes: '',
      created_at: new Date().toISOString(),
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
}

