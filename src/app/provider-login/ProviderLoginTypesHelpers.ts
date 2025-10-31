// ProviderLoginTypesHelpers.ts - Core entity type definitions
export interface ProviderType {
  id: string
  user_id: string
  business_name: string
  contact_name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zip_code: string
  services: string[]
  description: string
  rating: number
  created_at: string
  updated_at: string
}

export interface ServiceRequestType {
  id: string
  user_id: string
  service_type: string
  title: string
  description: string
  location: string
  city: string
  state: string
  status: string
  budget_min: number
  budget_max: number
  created_at: string
  updated_at: string
  provider_claims?: any[]
  users?: any
}
