export interface Provider {
  id: string
  business_name: string
  contact_name: string
  email: string
  phone: string
  service_types: string[]
  location_city: string
  location_state: string
  is_verified: boolean
  is_blocked: boolean
  rating_safe: number
  rating_reliable: number
  created_at: string
  updated_at: string
}

export interface ProviderFormData {
  business_name: string
  contact_name: string
  email: string
  phone: string
  service_types: string[]
  location_city: string
  location_state: string
}

