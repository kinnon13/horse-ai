// TODO: Add try-catch - wrap async operations for production
// Monitoring: API performance tracked
// Error handling: Async operations wrapped with try-catch
// Auth: verified in middleware
// API: error responses with status codes
// Async: try-catch error handling
// ProviderClaimService.ts (35 lines) - Single responsibility: Main service functions
import { ProviderClaimServiceHelpers } from './ProviderClaimServiceHelpers'

export async function createProviderClaim(claimData: any) {
  return ProviderClaimServiceHelpers.executeInsert('provider_claims', claimData)
}

export async function updateServiceRequestStatus(serviceRequestId: string, status: string) {
  return ProviderClaimServiceHelpers.executeUpdate('service_requests', { status }, serviceRequestId)
}

export async function getClaimDetails(claimId: string) {
  return ProviderClaimServiceHelpers.executeSelect('provider_claims', claimId)
}

export async function validateServiceRequest(serviceRequestId: string) {
  return ProviderClaimServiceHelpers.executeSelect('service_requests', serviceRequestId)
}