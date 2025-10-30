// Service Request Claim Service - Single responsibility
export interface ProviderClaim {
  id: string
  provider_id: string
  request_id: string
  status: 'pending' | 'accepted' | 'rejected'
  created_at: string
  updated_at: string
}

export class ServiceRequestClaimService {
  static async createClaim(claimData: Omit<ProviderClaim, 'id' | 'created_at' | 'updated_at'>) {
    return {
      id: 'claim_' + Date.now(),
      ...claimData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }

  static async updateClaim(claimId: string, updates: Partial<ProviderClaim>) {
    return {
      id: claimId,
      ...updates,
      updated_at: new Date().toISOString()
    }
  }

  static async getClaim(claimId: string) {
    return {
      id: claimId,
      provider_id: 'provider_123',
      request_id: 'request_123',
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }
}