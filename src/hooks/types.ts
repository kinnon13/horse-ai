export interface ServiceRequest {
  id: string
  user_id: string
  request_type: string
  details: string
  location_city: string
  location_state: string
  lat?: number
  lng?: number
  status: string
  created_at: string
  updated_at: string
}

export interface ServiceRequestFilters {
  status?: string
  request_type?: string
  user_id?: string
}

export interface CreateServiceRequestData {
  request_type: string
  details: string
  location_city: string
  location_state: string
  lat?: number
  lng?: number
}

