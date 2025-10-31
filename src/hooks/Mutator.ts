// Mutator.ts (35 lines) - Single responsibility: Main mutator logic
import { ServiceRequest, CreateServiceRequestData } from './types'
import { MutatorHelpers } from './MutatorHelpers'

export class Mutator {
  async createServiceRequest(data: CreateServiceRequestData): Promise<ServiceRequest> {
    try {
      return await MutatorHelpers.makeCreateRequest(data)
    } catch (error) {
      console.error('Error creating service request:', error)
      throw error
    }
  }

  async updateServiceRequest(id: string, updates: Partial<ServiceRequest>): Promise<ServiceRequest> {
    try {
      return await MutatorHelpers.makeUpdateRequest(id, updates)
    } catch (error) {
      console.error('Error updating service request:', error)
      throw error
    }
  }

  async deleteServiceRequest(id: string): Promise<void> {
    try {
      return await MutatorHelpers.makeDeleteRequest(id)
    } catch (error) {
      console.error('Error deleting service request:', error)
      throw error
    }
  }
}

