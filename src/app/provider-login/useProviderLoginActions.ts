// TODO: Add try-catch - wrap async operations for production
import type { ProviderLoginPageActions, ProviderType, ServiceRequestType } from './ProviderLoginTypes'
import { claimServiceRequest } from './ProviderClaimsService'
import { fetchProviderDataWithState } from './ProviderDataHandler'
import { fetchServiceRequestsWithState } from './ServiceRequestsHandler'

export function useProviderLoginActions(
  user: any,
  provider: ProviderType | null,
  setProvider: (provider: ProviderType | null) => void,
  setServiceRequests: (requests: ServiceRequestType[]) => void,
  setLoadingRequests: (loading: boolean) => void
): ProviderLoginPageActions {
  const fetchProviderData = async () => {
    await fetchProviderDataWithState(user, setProvider)
  }

  const fetchServiceRequests = async () => {
    await fetchServiceRequestsWithState(setServiceRequests, setLoadingRequests)
  }

  const handleClaimRequest = async (requestId: string) => {
    if (!user || !provider) return
    await claimServiceRequest(provider.id, requestId)
    fetchServiceRequests()
  }

  const handleViewDetails = (requestId: string) => {
    window.location.href = `/service-requests/${requestId}`
  }

  const handleEditProfile = () => {
    window.location.href = '/provider-portal'
  }

  return {
    fetchProviderData,
    fetchServiceRequests,
    handleClaimRequest,
    handleViewDetails,
    handleEditProfile
  }
}