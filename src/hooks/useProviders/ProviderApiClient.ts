import { Provider, ProviderFilters } from './types'
import { ProviderApiHelpers } from './ProviderApiHelpers'

export class ProviderApiClient {
  static async fetchProviders(filters: ProviderFilters) {
    return ProviderApiHelpers.fetchProviders(filters)
  }

  static async createProvider(providerData: Omit<Provider, 'id' | 'created_at' | 'updated_at'>) {
    return ProviderApiHelpers.createProvider(providerData)
  }

  static async updateProvider(id: string, updateData: Partial<Provider>) {
    return ProviderApiHelpers.updateProvider(id, updateData)
  }
}