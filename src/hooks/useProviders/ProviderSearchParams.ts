import { ProviderFilters } from './types'

export class ProviderSearchParams {
  static build(filters: ProviderFilters): URLSearchParams {
    const searchParams = new URLSearchParams()
    if (filters.service_type) searchParams.set('service_type', filters.service_type)
    if (filters.city) searchParams.set('city', filters.city)
    if (filters.state) searchParams.set('state', filters.state)
    if (filters.verified !== undefined) searchParams.set('verified', filters.verified.toString())
    if (filters.limit) searchParams.set('limit', filters.limit.toString())
    return searchParams
  }
}

