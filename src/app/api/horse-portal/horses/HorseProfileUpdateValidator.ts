import { HorseProfile } from './HorseProfileTypes'

export function validateHorseUpdate(data: any): Partial<HorseProfile> {
  const updateData: Partial<HorseProfile> = {}

  if (data.horse_name) updateData.horse_name = data.horse_name.trim()
  if (data.breed) updateData.breed = data.breed.trim()
  if (data.year_born) {
    if (typeof data.year_born !== 'number' || data.year_born < 1900 || data.year_born > new Date().getFullYear()) {
      throw new Error('Invalid year_born')
    }
    updateData.year_born = data.year_born
  }
  if (data.sex) {
    const validSexes = ['mare', 'stallion', 'gelding', 'filly', 'colt']
    if (!validSexes.includes(data.sex)) {
      throw new Error('Invalid sex')
    }
    updateData.sex = data.sex
  }
  if (data.color) updateData.color = data.color.trim()
  if (data.registration_number) updateData.registration_number = data.registration_number.trim()
  if (data.sire) updateData.sire = data.sire.trim()
  if (data.dam) updateData.dam = data.dam.trim()
  if (data.notes) updateData.notes = data.notes.trim()

  return updateData
}

