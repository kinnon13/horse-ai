import { ServiceRequest } from './ProviderPortalTypes'

export interface ServiceRequestCardProps {
  request: ServiceRequest
  onClaim: (requestId: string) => void
  onViewDetails: (requestId: string) => void
}

export interface ServiceRequestCardHeaderProps {
  request: ServiceRequest
  onViewDetails: (requestId: string) => void
}

export interface ServiceRequestCardDetailsProps {
  request: ServiceRequest
}

export interface ServiceRequestCardActionsProps {
  request: ServiceRequest
  onClaim: (requestId: string) => void
  onViewDetails: (requestId: string) => void
}

