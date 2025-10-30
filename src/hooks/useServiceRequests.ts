import type { ServiceRequest as AdminServiceRequest } from '@/app/admin-secret-xyz123/requests/RequestsTypes'

// Re-export the admin type for consistency
export type ServiceRequest = AdminServiceRequest

export interface CreateServiceRequestData {
  service_type: string
  description: string
  location_city: string
  location_state: string
}

export interface ServiceRequestFilters {
  status?: string
  service_type?: string
  location_city?: string
  location_state?: string
}

export function useServiceRequests() {
  return {
    serviceRequests: [] as ServiceRequest[],
    loading: false,
    error: null,
    fetchServiceRequests: () => {},
    createServiceRequest: () => {},
    updateServiceRequest: () => {},
    deleteServiceRequest: () => {},
    refetch: () => {}
  };
}