// Provider and ServiceRequest type definitions
import type { ProviderType, ServiceRequestType } from './ProviderLoginTypesHelpers'

export type { ProviderType, ServiceRequestType }

export interface ProviderLoginPageState {
  provider: ProviderType | null
  serviceRequests: ServiceRequestType[]
  loadingRequests: boolean
  loading: boolean
  user: any
}

export interface ProviderLoginPageActions {
  fetchProviderData: () => Promise<void>
  fetchServiceRequests: () => Promise<void>
  handleClaimRequest: (requestId: string) => Promise<void>
  handleViewDetails: (requestId: string) => void
  handleEditProfile: () => void
}

export interface ProviderLoginPageProps {
  state: ProviderLoginPageState
  actions: ProviderLoginPageActions
}

export interface ProviderLoginContentProps {
  provider: ProviderType
  serviceRequests: ServiceRequestType[]
  loadingRequests: boolean
  onClaim: (requestId: string) => Promise<void>
  onViewDetails: (requestId: string) => void
  onEditProfile: () => void
}
