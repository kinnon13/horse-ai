export interface DispatchStats {
  totalRequests: number
  openRequests: number
  claimedRequests: number
  completedRequests: number
  totalProviders: number
  verifiedProviders: number
}

export interface ServiceRequest {
  id: string
  user_id: string
  service_type: string
  description: string
  location_city: string
  location_state: string
  status: string
  created_at: string
  updated_at: string
  user_name?: string
  user_email?: string
  provider_claims?: any[]
}

