import { HorseProfile } from './HorseProfileTypes'

export function validateHorseProfile(data: any): Omit<HorseProfile, 'id' | 'created_at' | 'updated_at'> {
  const requiredFields = ['horse_name', 'breed', 'year_born', 'sex', 'color', 'owner_id']
  
  for (const field of requiredFields) {
    if (!data[field]) {
      throw new Error(`Missing required field: ${field}`)
    }
  }

  if (typeof data.year_born !== 'number' || data.year_born < 1900 || data.year_born > new Date().getFullYear()) {
    throw new Error('Invalid year_born')
  }

  const validSexes = ['mare', 'stallion', 'gelding', 'filly', 'colt']
  if (!validSexes.includes(data.sex)) {
    throw new Error('Invalid sex')
  }

  return {
    horse_name: data.horse_name.trim(),
    breed: data.breed.trim(),
    year_born: data.year_born,
    sex: data.sex,
    color: data.color.trim(),
    owner_id: data.owner_id,
    registration_number: data.registration_number?.trim(),
    sire: data.sire?.trim(),
    dam: data.dam?.trim(),
    notes: data.notes?.trim()
  }
}