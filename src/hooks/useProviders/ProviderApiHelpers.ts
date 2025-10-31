import { Provider, ProviderFilters } from './types'
import { ProviderSearchParams } from './ProviderSearchParams'

export class ProviderApiHelpers {
  static async fetchProviders(filters: ProviderFilters) {
    const searchParams = ProviderSearchParams.build(filters)
    const response = await fetch(`/api/providers?${searchParams.toString()}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch providers')
    }

    const data = await response.json()
    return data.providers || []
  }

  static async createProvider(providerData: Omit<Provider, 'id' | 'created_at' | 'updated_at'>) {
    const response = await fetch('/api/providers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(providerData),
    })

    if (!response.ok) {
      throw new Error('Failed to create provider')
    }

    const data = await response.json()
    return data.provider
  }

  static async updateProvider(id: string, updateData: Partial<Provider>) {
    const response = await fetch('/api/providers', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updateData }),
    })

    if (!response.ok) {
      throw new Error('Failed to update provider')
    }

    const data = await response.json()
    return data.provider
  }
}