import { LeadGenerationUserService } from './LeadGenerationUserService'
import { LeadGenerationFinderService } from './LeadGenerationFinderService'
import { LeadGenerationStorageService } from './LeadGenerationStorageService'

export class LeadGenerationService {
  private userService = new LeadGenerationUserService()
  private finderService = new LeadGenerationFinderService()
  private storageService = new LeadGenerationStorageService()

  async checkUserSubscription(userId: string) {
    return await this.userService.checkUserSubscription(userId)
  }

  async generateLeads(type: string, criteria: any, message?: string) {
    const leadGenerators = {
      buyer: () => this.finderService.findBuyers(criteria),
      seller: () => this.finderService.findSellers(criteria),
      breeder: () => this.finderService.findBreeders(criteria),
      service: () => this.finderService.findServiceProviders(criteria)
    }

    const generator = leadGenerators[type as keyof typeof leadGenerators]
    if (!generator) throw new Error('Invalid lead type')

    return await generator()
  }

  async saveLeadGeneration(userId: string, leadData: any) {
    return await this.storageService.saveLeadGeneration(userId, leadData)
  }
}