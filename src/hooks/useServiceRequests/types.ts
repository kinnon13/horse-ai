export interface ServiceRequest {
  id: string
  user_id: string | null
  request_type: string
  details: string | null
  location_city: string | null
  location_state: string | null
  lat: number | null
  lng: number | null
  status: string
  created_at: string
  updated_at: string
  providers?: {
    id: string
    business_name: string
    contact_name: string | null
    phone: string | null
    email: string | null
    service_type: string
    specialty: string | null
  }
  provider_claims?: ProviderClaim[]
}

export interface ProviderClaim {
  id: string
  service_request_id: string
  provider_id: string
  message: string | null
  quoted_price: string | null
  status: string
  created_at: string
  providers?: {
    id: string
    business_name: string
    contact_name: string | null
    phone: string | null
    email: string | null
    service_type: string
    specialty: string | null
  }
  service_requests?: {
    id: string
    user_id: string | null
    request_type: string
    details: string | null
    location_city: string | null
    location_state: string | null
    status: string
  }
}

export interface ServiceRequestFilters {
  user_id?: string
  status?: string
  request_type?: string
  location_city?: string
  location_state?: string
  date_from?: string
  date_to?: string
}

export interface CreateServiceRequestData {
  request_type: string
  details: string
  location_city: string
  location_state: string
  lat?: number
  lng?: number
}

