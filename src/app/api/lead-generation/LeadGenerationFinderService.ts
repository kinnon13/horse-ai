import { findBuyers } from './LeadFinderBuyers'
import { findSellers } from './LeadFinderSellers'
import { findBreeders } from './LeadFinderBreeders'
import { findServiceProviders } from './LeadFinderProviders'

export class LeadGenerationFinderService {
  async findBuyers(criteria: any) {
    return findBuyers(criteria)
  }

  async findSellers(criteria: any) {
    return findSellers(criteria)
  }

  async findBreeders(criteria: any) {
    return findBreeders(criteria)
  }

  async findServiceProviders(criteria: any) {
    return findServiceProviders(criteria)
  }
}

