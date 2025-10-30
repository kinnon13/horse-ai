export interface ServiceRequest {
  id: string
  user_id: string
  user_email: string
  title: string
  description: string
  service_type: string
  location_city: string
  location_state: string
  preferred_date?: string
  budget_range?: string
  priority: string
  status: string
  created_at: string
  updated_at: string
  users?: {
    full_name: string
    phone?: string
  }
}

export interface ProviderClaim {
  id: string
  provider_id: string
  service_request_id: string
  status: string
  price_quoted?: number
  notes?: string
  created_at: string
  updated_at: string
}