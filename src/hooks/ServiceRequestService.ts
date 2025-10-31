import { ServiceRequest, CreateServiceRequestData } from './types'
import { ServiceRequestFetcher } from './ServiceRequestFetcher'
import { ServiceRequestMutator } from './ServiceRequestMutator'

export class ServiceRequestService {
  private fetcher = new ServiceRequestFetcher()
  private mutator = new ServiceRequestMutator()

  async getServiceRequests(filters: any = {}): Promise<ServiceRequest[]> {
    return this.fetcher.getServiceRequests(filters)
  }

  async createServiceRequest(data: CreateServiceRequestData): Promise<ServiceRequest> {
    return this.mutator.createServiceRequest(data)
  }

  async updateServiceRequest(id: string, updates: Partial<ServiceRequest>): Promise<ServiceRequest> {
    return this.mutator.updateServiceRequest(id, updates)
  }

  async deleteServiceRequest(id: string): Promise<void> {
    return this.mutator.deleteServiceRequest(id)
  }
}

