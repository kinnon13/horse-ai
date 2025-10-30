import { StallionProfile } from './StallionProfileTypes'

export function validateStallionProfile(data: any): Omit<StallionProfile, 'id' | 'created_at' | 'updated_at'> {
  const requiredFields = ['stallion_name', 'breed', 'year_born', 'color', 'station_id']
  
  for (const field of requiredFields) {
    if (!data[field]) {
      throw new Error(`Missing required field: ${field}`)
    }
  }

  if (typeof data.year_born !== 'number' || data.year_born < 1900 || data.year_born > new Date().getFullYear()) {
    throw new Error('Invalid year_born')
  }

  if (data.stud_fee && (typeof data.stud_fee !== 'number' || data.stud_fee < 0)) {
    throw new Error('Invalid stud_fee')
  }

  return {
    stallion_name: data.stallion_name.trim(),
    breed: data.breed.trim(),
    year_born: data.year_born,
    color: data.color.trim(),
    station_id: data.station_id,
    registration_number: data.registration_number?.trim(),
    sire: data.sire?.trim(),
    dam: data.dam?.trim(),
    stud_fee: data.stud_fee,
    booking_contact: data.booking_contact?.trim(),
    notes: data.notes?.trim()
  }
}