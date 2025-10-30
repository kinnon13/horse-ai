import { Provider, ServiceRequest } from './ProviderLoginTypes'

export interface ProviderLoginPageState {
  provider: Provider | null
  serviceRequests: ServiceRequest[]
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
  provider: Provider
  serviceRequests: ServiceRequest[]
  loadingRequests: boolean
  onClaim: (requestId: string) => Promise<void>
  onViewDetails: (requestId: string) => void
  onEditProfile: () => void
}