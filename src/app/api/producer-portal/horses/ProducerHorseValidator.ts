import { ProducerHorse } from './ProducerHorseTypes'

const REQUIRED_FIELDS = ['producer_id', 'horse_name', 'breed', 'sex', 'birth_year', 'color']
const VALID_SEXES = ['mare', 'stallion', 'gelding', 'filly', 'colt', 'unknown']
const VALID_BREEDING_STATUS = ['active', 'inactive', 'retired', 'deceased']

export function validateProducerHorse(data: any): Omit<ProducerHorse, 'id' | 'created_at' | 'updated_at'> {
  for (const field of REQUIRED_FIELDS) {
    if (!data[field]) throw new Error(`Missing required field: ${field}`)
  }

  if (typeof data.birth_year !== 'number' || data.birth_year < 1900 || data.birth_year > new Date().getFullYear()) {
    throw new Error('Invalid birth_year')
  }

  if (!VALID_SEXES.includes(data.sex)) throw new Error('Invalid sex')

  if (data.breeding_status && !VALID_BREEDING_STATUS.includes(data.breeding_status)) {
    throw new Error('Invalid breeding_status')
  }

  return {
    producer_id: data.producer_id,
    horse_name: data.horse_name.trim(),
    registered_name: data.registered_name?.trim(),
    registration_number: data.registration_number?.trim(),
    breed: data.breed.trim(),
    sex: data.sex,
    birth_year: data.birth_year,
    color: data.color.trim(),
    sire_name: data.sire_name?.trim(),
    sire_registration: data.sire_registration?.trim(),
    dam_name: data.dam_name?.trim(),
    dam_registration: data.dam_registration?.trim(),
    performance_disciplines: data.performance_disciplines || [],
    performance_earnings: data.performance_earnings || 0,
    performance_highlights: data.performance_highlights?.trim(),
    breeding_status: data.breeding_status || 'active',
    breeding_fee: data.breeding_fee ? parseFloat(data.breeding_fee) : undefined,
    breeding_terms: data.breeding_terms?.trim(),
    ai_available: data.ai_available || false,
    live_cover_available: data.live_cover_available || false,
    health_clearances: data.health_clearances || [],
    genetic_testing: data.genetic_testing || [],
    profile_photo_url: data.profile_photo_url?.trim(),
    video_url: data.video_url?.trim()
  }
}