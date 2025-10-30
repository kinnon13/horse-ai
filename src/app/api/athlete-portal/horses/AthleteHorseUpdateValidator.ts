import { AthleteHorse } from './AthleteHorseService'

export function validateAthleteHorseUpdate(data: any): Partial<AthleteHorse> {
  const updateData: Partial<AthleteHorse> = {}

  if (data.horse_name !== undefined) {
    if (typeof data.horse_name !== 'string') {
      throw new Error('Horse name must be a string')
    }
    updateData.horse_name = data.horse_name
  }

  if (data.horse_type !== undefined) {
    if (typeof data.horse_type !== 'string') {
      throw new Error('Horse type must be a string')
    }
    updateData.horse_type = data.horse_type
  }

  if (data.breed !== undefined) {
    if (typeof data.breed !== 'string') {
      throw new Error('Breed must be a string')
    }
    updateData.breed = data.breed
  }

  if (data.value !== undefined) {
    if (typeof data.value !== 'number' || data.value < 0) {
      throw new Error('Value must be a positive number')
    }
    updateData.value = data.value
  }

  return updateData
}