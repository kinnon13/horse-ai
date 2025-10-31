// ProducerProfile.ts (30 lines) - Producer profile type
export interface ProducerProfile {
  id: string
  name: string
  email: string
  phone?: string
  location_city?: string
  location_state?: string
  location_country?: string
  business_name?: string
  website?: string
  bio?: string
  specialties?: string[]
  years_experience?: number
  created_at: string
  updated_at: string
}
