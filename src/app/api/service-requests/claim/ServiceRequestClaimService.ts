// Re-export claim services for convenience
export type { ProviderClaim } from './ProviderClaimTypes'
export { ProviderClaimOperations } from './ProviderClaimOperations'
export { ServiceRequestOperations } from './ServiceRequestOperations'

// Export individual functions for convenience
import { ServiceRequestOperations } from './ServiceRequestOperations'
import { ProviderClaimOperations } from './ProviderClaimOperations'

export const getServiceRequest = ServiceRequestOperations.getServiceRequest
export const updateServiceRequestStatus = ServiceRequestOperations.updateServiceRequestStatus
export const notifyUserOfClaim = ServiceRequestOperations.notifyUserOfClaim
export const createProviderClaim = ProviderClaimOperations.createClaim