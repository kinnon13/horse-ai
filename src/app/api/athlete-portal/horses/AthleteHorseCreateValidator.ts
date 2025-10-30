import { AthleteHorse } from './AthleteHorseService'

export function validateAthleteHorseCreate(data: any): Omit<AthleteHorse, 'id' | 'created_at' | 'updated_at'> {
  if (!data.athlete_id || typeof data.athlete_id !== 'string') {
    throw new Error('Athlete ID is required')
  }
  if (!data.horse_name || typeof data.horse_name !== 'string') {
    throw new Error('Horse name is required')
  }
  if (!data.horse_type || typeof data.horse_type !== 'string') {
    throw new Error('Horse type is required')
  }
  if (!data.breed || typeof data.breed !== 'string') {
    throw new Error('Breed is required')
  }
  if (data.value !== undefined && (typeof data.value !== 'number' || data.value < 0)) {
    throw new Error('Value must be a positive number')
  }

  return {
    athlete_id: data.athlete_id,
    horse_name: data.horse_name,
    horse_type: data.horse_type,
    breed: data.breed,
    value: data.value
  }
}
