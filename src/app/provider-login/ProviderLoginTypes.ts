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

// --- AUTO-ADDED STUB EXPORTS (safe to replace with real code) ---
export function Provider(_props?: any): never { throw new Error("Stubbed component used: ./ProviderLoginTypes.Provider"); }

// --- AUTO-ADDED STUB EXPORTS (safe to replace with real code) ---
export function ProviderLoginContentProps(_props?: any): never { throw new Error("Stubbed component used: ./ProviderLoginTypes.ProviderLoginContentProps"); }

// --- AUTO-ADDED STUB EXPORTS (safe to replace with real code) ---
export function ServiceRequest(_props?: any): never { throw new Error("Stubbed component used: ./ProviderLoginTypes.ServiceRequest"); }

// --- AUTO-ADDED STUB EXPORTS (safe to replace with real code) ---
export function ProviderLoginPageState(_props?: any): never { throw new Error("Stubbed component used: ./ProviderLoginTypes.ProviderLoginPageState"); }
export function ProviderLoginPageActions(_props?: any): never { throw new Error("Stubbed component used: ./ProviderLoginTypes.ProviderLoginPageActions"); }
