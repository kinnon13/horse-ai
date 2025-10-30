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




// --- AUTO-ADDED STUB EXPORTS (safe to replace with real code) ---
export function ServiceRequestCardProps(_props?: any): never { throw new Error("Stubbed component used: ./ServiceRequestCardTypes.ServiceRequestCardProps"); }

// --- AUTO-ADDED STUB EXPORTS (safe to replace with real code) ---
export function ServiceRequestCardActionsProps(_props?: any): never { throw new Error("Stubbed component used: ./ServiceRequestCardTypes.ServiceRequestCardActionsProps"); }

// --- AUTO-ADDED STUB EXPORTS (safe to replace with real code) ---
export function ServiceRequestCardDetailsProps(_props?: any): never { throw new Error("Stubbed component used: ./ServiceRequestCardTypes.ServiceRequestCardDetailsProps"); }

// --- AUTO-ADDED STUB EXPORTS (safe to replace with real code) ---
export function ServiceRequestCardHeaderProps(_props?: any): never { throw new Error("Stubbed component used: ./ServiceRequestCardTypes.ServiceRequestCardHeaderProps"); }
