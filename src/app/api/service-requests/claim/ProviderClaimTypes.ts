// Provider Claim Types
export interface ProviderClaim {
  id: string
  provider_id: string
  request_id: string
  status: 'pending' | 'accepted' | 'rejected'
  created_at: string
  updated_at: string
}

