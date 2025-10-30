import { ProviderLoginPageActions } from './ProviderLoginTypes'
import { claimServiceRequest } from './ProviderClaimsService'
import { fetchProviderDataWithState } from './ProviderDataHandler'
import { fetchServiceRequestsWithState } from './ServiceRequestsHandler'

export function useProviderLoginActions(
  user: any,
  provider: Provider | null,
  setProvider: (provider: Provider | null) => void,
  setServiceRequests: (requests: ServiceRequest[]) => void,
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