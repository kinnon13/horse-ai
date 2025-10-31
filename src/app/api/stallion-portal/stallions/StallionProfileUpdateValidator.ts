import { StallionProfile } from './StallionProfileTypes'

export function validateStallionUpdate(data: any): Partial<StallionProfile> {
  const updateData: Partial<StallionProfile> = {}

  if (data.stallion_name) updateData.stallion_name = data.stallion_name.trim()
  if (data.breed) updateData.breed = data.breed.trim()
  if (data.year_born) {
    if (typeof data.year_born !== 'number' || data.year_born < 1900 || data.year_born > new Date().getFullYear()) {
      throw new Error('Invalid year_born')
    }
    updateData.year_born = data.year_born
  }
  if (data.color) updateData.color = data.color.trim()
  if (data.registration_number) updateData.registration_number = data.registration_number.trim()
  if (data.sire) updateData.sire = data.sire.trim()
  if (data.dam) updateData.dam = data.dam.trim()
  if (data.stud_fee !== undefined) {
    if (typeof data.stud_fee !== 'number' || data.stud_fee < 0) {
      throw new Error('Invalid stud_fee')
    }
    updateData.stud_fee = data.stud_fee
  }
  if (data.booking_contact) updateData.booking_contact = data.booking_contact.trim()
  if (data.notes) updateData.notes = data.notes.trim()

  return updateData
}




