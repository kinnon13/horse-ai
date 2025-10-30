import { AthleteHorse } from './AthleteHorseTypes'

const VALID_SEXES = ['mare', 'stallion', 'gelding', 'filly', 'colt']
const VALID_PARTNERSHIP_TYPES = ['owned', 'leased', 'training']

export function validateAthleteHorseUpdate(data: any): Partial<AthleteHorse> {
  const updateData: Partial<AthleteHorse> = {}

  if (data.horse_name) updateData.horse_name = data.horse_name.trim()
  if (data.breed) updateData.breed = data.breed.trim()
  if (data.year_born) {
    if (typeof data.year_born !== 'number' || data.year_born < 1900 || data.year_born > new Date().getFullYear()) {
      throw new Error('Invalid year_born')
    }
    updateData.year_born = data.year_born
  }
  if (data.sex) {
    if (!VALID_SEXES.includes(data.sex)) throw new Error('Invalid sex')
    updateData.sex = data.sex
  }
  if (data.color) updateData.color = data.color.trim()
  if (data.partnership_type) {
    if (!VALID_PARTNERSHIP_TYPES.includes(data.partnership_type)) throw new Error('Invalid partnership_type')
    updateData.partnership_type = data.partnership_type
  }
  if (data.registration_number) updateData.registration_number = data.registration_number.trim()
  if (data.sire) updateData.sire = data.sire.trim()
  if (data.dam) updateData.dam = data.dam.trim()
  if (data.notes) updateData.notes = data.notes.trim()

  return updateData
}

