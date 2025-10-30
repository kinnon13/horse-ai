export interface ProducerProfile {
  id: string
  business_name: string
  contact_name: string
  email: string
  phone: string | null
  website: string | null
  location_city: string | null
  location_state: string | null
  location_country: string
  years_in_business: number | null
  specialties: string[]
  breeding_focus: string | null
  total_mares: number
  total_stallions: number
  annual_foals: number
  breeding_methods: string[]
  taking_clients: boolean
  verified: boolean
  featured: boolean
  subscription_tier: string
  subscription_expires_at: string | null
  created_at: string
  updated_at: string
}

export interface ProducerHorse {
  id: string
  producer_id: string
  horse_name: string
  registered_name: string | null
  registration_number: string | null
  breed: string
  year_born: number
  sex: string
  color: string
  sire: string | null
  dam: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface ProducerEvent {
  id: string
  producer_id: string
  event_name: string
  event_type: string
  event_date: string
  location: string | null
  description: string | null
  created_at: string
  updated_at: string
}

