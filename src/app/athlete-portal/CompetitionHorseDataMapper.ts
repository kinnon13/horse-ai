// CompetitionHorseDataMapper.ts (25 lines) - Form data to horse data mapping
import { CompetitionHorse } from './AthleteHorseTypes'
import { CompetitionHorseFormData } from './CompetitionHorseFormTypes'
import { CompetitionHorseBaseBuilder } from './CompetitionHorseBaseBuilder'

export class CompetitionHorseDataMapper {
  static buildHorseData(horse: CompetitionHorse | undefined, formData: CompetitionHorseFormData): CompetitionHorse {
    const baseHorse = horse || CompetitionHorseBaseBuilder.createBaseHorse()

    return {
      ...baseHorse,
      horse_name: formData.name,
      breed: formData.breed,
      birth_year: parseInt(formData.age) || 0,
      sex: formData.gender,
      color: formData.color,
      registration_number: formData.registration_number,
      owner_name: formData.owner_name,
      owner_phone: formData.owner_phone,
      owner_email: formData.owner_email,
      notes: formData.notes,
      updated_at: new Date().toISOString(),
    }
  }
}

