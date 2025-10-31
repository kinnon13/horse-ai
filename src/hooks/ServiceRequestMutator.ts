// ServiceRequestMutator.ts (50 lines)
import { ServiceRequest, CreateServiceRequestData } from './types'
import { ServiceRequestMutatorHelpers } from './ServiceRequestMutatorHelpers'

export class ServiceRequestMutator {
  async createServiceRequest(data: CreateServiceRequestData): Promise<ServiceRequest> {
    return ServiceRequestMutatorHelpers.createServiceRequest(data)
  }

  async updateServiceRequest(id: string, updates: Partial<ServiceRequest>): Promise<ServiceRequest> {
    return ServiceRequestMutatorHelpers.updateServiceRequest(id, updates)
  }

  async deleteServiceRequest(id: string): Promise<void> {
    return ServiceRequestMutatorHelpers.deleteServiceRequest(id)
  }
}