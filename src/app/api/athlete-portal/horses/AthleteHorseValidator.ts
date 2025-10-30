import { AthleteHorse } from './AthleteHorseTypes'

const REQUIRED_FIELDS = ['horse_name', 'breed', 'year_born', 'sex', 'color', 'athlete_id', 'partnership_type']
const VALID_SEXES = ['mare', 'stallion', 'gelding', 'filly', 'colt']
const VALID_PARTNERSHIP_TYPES = ['owned', 'leased', 'training']

export function validateAthleteHorse(data: any): Omit<AthleteHorse, 'id' | 'created_at' | 'updated_at'> {
  for (const field of REQUIRED_FIELDS) {
    if (!data[field]) throw new Error(`Missing required field: ${field}`)
  }

  if (typeof data.year_born !== 'number' || data.year_born < 1900 || data.year_born > new Date().getFullYear()) {
    throw new Error('Invalid year_born')
  }

  if (!VALID_SEXES.includes(data.sex)) throw new Error('Invalid sex')
  if (!VALID_PARTNERSHIP_TYPES.includes(data.partnership_type)) throw new Error('Invalid partnership_type')

  return {
    horse_name: data.horse_name.trim(),
    breed: data.breed.trim(),
    year_born: data.year_born,
    sex: data.sex,
    color: data.color.trim(),
    athlete_id: data.athlete_id,
    partnership_type: data.partnership_type,
    registration_number: data.registration_number?.trim(),
    sire: data.sire?.trim(),
    dam: data.dam?.trim(),
    notes: data.notes?.trim()
  }
}