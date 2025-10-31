import type { ServiceRequestType } from './ProviderLoginTypes'
import { fetchServiceRequests } from './ServiceRequestsService'

export async function fetchServiceRequestsWithState(
  setServiceRequests: (requests: ServiceRequestType[]) => void,
  setLoadingRequests: (loading: boolean) => void
): Promise<void> {
  setLoadingRequests(true)
  try {
    const data = await fetchServiceRequests()
    setServiceRequests(data)
  } finally {
    setLoadingRequests(false)
  }
}




