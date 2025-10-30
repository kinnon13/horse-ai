export interface ProviderClaim {
  id?: string
  provider_id: string
  service_request_id: string
  price_quoted?: number
  notes?: string
  status: 'pending' | 'accepted' | 'rejected'
  created_at?: string
  updated_at?: string
}

export interface ServiceRequest {
  id: string
  status: string
  user_id: string
}

