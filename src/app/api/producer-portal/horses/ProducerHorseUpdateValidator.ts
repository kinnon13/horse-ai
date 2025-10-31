import { ProducerHorse } from './ProducerHorseTypes'

const VALID_SEXES = ['mare', 'stallion', 'gelding', 'filly', 'colt', 'unknown']
const VALID_BREEDING_STATUS = ['active', 'inactive', 'retired', 'deceased']

export function validateProducerHorseUpdate(data: any): Partial<ProducerHorse> {
  const updateData: Partial<ProducerHorse> = {}

  if (data.horse_name) updateData.horse_name = data.horse_name.trim()
  if (data.registered_name) updateData.registered_name = data.registered_name.trim()
  if (data.registration_number) updateData.registration_number = data.registration_number.trim()
  if (data.breed) updateData.breed = data.breed.trim()
  if (data.sex) {
    if (!VALID_SEXES.includes(data.sex)) throw new Error('Invalid sex')
    updateData.sex = data.sex
  }
  if (data.birth_year) {
    if (typeof data.birth_year !== 'number' || data.birth_year < 1900 || data.birth_year > new Date().getFullYear()) {
      throw new Error('Invalid birth_year')
    }
    updateData.birth_year = data.birth_year
  }
  if (data.color) updateData.color = data.color.trim()
  if (data.sire_name) updateData.sire_name = data.sire_name.trim()
  if (data.sire_registration) updateData.sire_registration = data.sire_registration.trim()
  if (data.dam_name) updateData.dam_name = data.dam_name.trim()
  if (data.dam_registration) updateData.dam_registration = data.dam_registration.trim()
  if (data.performance_disciplines) updateData.performance_disciplines = data.performance_disciplines
  if (data.performance_earnings) updateData.performance_earnings = data.performance_earnings
  if (data.performance_highlights) updateData.performance_highlights = data.performance_highlights.trim()
  if (data.breeding_status) {
    if (!VALID_BREEDING_STATUS.includes(data.breeding_status)) throw new Error('Invalid breeding_status')
    updateData.breeding_status = data.breeding_status
  }
  if (data.breeding_fee) updateData.breeding_fee = parseFloat(data.breeding_fee)
  if (data.breeding_terms) updateData.breeding_terms = data.breeding_terms.trim()
  if (data.ai_available !== undefined) updateData.ai_available = data.ai_available
  if (data.live_cover_available !== undefined) updateData.live_cover_available = data.live_cover_available
  if (data.health_clearances) updateData.health_clearances = data.health_clearances
  if (data.genetic_testing) updateData.genetic_testing = data.genetic_testing
  if (data.profile_photo_url) updateData.profile_photo_url = data.profile_photo_url.trim()
  if (data.video_url) updateData.video_url = data.video_url.trim()

  return updateData
}




