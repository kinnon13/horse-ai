import React from 'react'
import { CompetitionHorse } from './AthleteHorseTypes'

export class ModalHelpers {
  static buildHorseData(formData: any, horse?: CompetitionHorse | null): CompetitionHorse {
    const baseHorse = horse || {} as CompetitionHorse
    return {
      ...baseHorse,
      id: baseHorse?.id || '',
      athlete_id: baseHorse?.athlete_id || '',
      horse_name: formData.name || formData.horse_name || '',
      registered_name: formData.registered_name || '',
      registration_number: formData.registration_number || '',
      breed: formData.breed || '',
      color: formData.color || '',
      sex: formData.sex || formData.gender || '',
      birth_year: formData.birth_year ? parseInt(formData.birth_year) : 0,
      sire: '',
      dam: '',
      owner_name: formData.owner_name || '',
      owner_phone: formData.owner_phone || '',
      owner_email: formData.owner_email || '',
      location_city: '',
      location_state: '',
      value: 0,
      notes: formData.notes || '',
      created_at: baseHorse?.created_at || new Date().toISOString(),
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

  static handleFormSubmit(e: React.FormEvent, onSave: (horse: CompetitionHorse) => void, formData: any, horse?: CompetitionHorse | null) {
    e.preventDefault()
    const horseData = ModalHelpers.buildHorseData(formData, horse)
    onSave(horseData)
  }
}
