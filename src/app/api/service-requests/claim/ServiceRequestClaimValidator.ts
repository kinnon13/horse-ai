import { ProviderClaim } from './ServiceRequestClaimService'

export function validateProviderClaim(data: any): Omit<ProviderClaim, 'id' | 'created_at' | 'updated_at'> {
  if (!data.provider_id || !data.service_request_id) {
    throw new Error('Provider ID and service request ID are required')
  }

  if (data.price_quoted && (typeof data.price_quoted !== 'number' || data.price_quoted < 0)) {
    throw new Error('Invalid price quoted')
  }

  return {
    provider_id: data.provider_id,
    service_request_id: data.service_request_id,
    price_quoted: data.price_quoted ? parseFloat(data.price_quoted) : undefined,
    notes: data.notes?.trim(),
    status: 'pending'
  }
}

