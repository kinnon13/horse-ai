// operationsMappers.ts - Provider mapping functions
import { Provider } from './types'
export function mapProviderFromDb(dbProvider: any): Provider {
  return {
    id: dbProvider.id,
    business_name: dbProvider.business_name,
    contact_name: dbProvider.contact_name,
    phone: dbProvider.phone,
    email: dbProvider.email,
    service_type: dbProvider.service_type,
    service_types: dbProvider.service_type ? [dbProvider.service_type] : [],
    specialty: dbProvider.specialty,
    city: dbProvider.city, state: dbProvider.state,
    location_city: dbProvider.city, location_state: dbProvider.state,
    verified: dbProvider.verified || false,
    is_verified: dbProvider.verified || false,
    sponsored: dbProvider.sponsored || false,
    admin_blocked: dbProvider.admin_blocked || false,
    is_blocked: dbProvider.admin_blocked || false,
    admin_block_reason: dbProvider.admin_block_reason,
    provider_last_seen_at: dbProvider.provider_last_seen_at,
    provider_active: dbProvider.provider_active ?? true,
    relationship_type: 'provider',
    notes: dbProvider.notes,
    rating_safe: 0, rating_reliable: 0,
    created_at: dbProvider.created_at, updated_at: dbProvider.updated_at
  }
}
export function mapProviderToDb(provider: Partial<Provider>): any {
  const dbData: any = {}
  if (provider.business_name !== undefined) dbData.business_name = provider.business_name
  if (provider.contact_name !== undefined) dbData.contact_name = provider.contact_name
  if (provider.phone !== undefined) dbData.phone = provider.phone
  if (provider.email !== undefined) dbData.email = provider.email
  if (provider.service_type !== undefined) dbData.service_type = provider.service_type
  if (provider.specialty !== undefined) dbData.specialty = provider.specialty
  if (provider.city !== undefined) dbData.city = provider.city
  if (provider.state !== undefined) dbData.state = provider.state
  if (provider.verified !== undefined) dbData.verified = provider.verified
  if (provider.is_verified !== undefined) dbData.verified = provider.is_verified
  if (provider.sponsored !== undefined) dbData.sponsored = provider.sponsored
  if (provider.admin_blocked !== undefined) dbData.admin_blocked = provider.admin_blocked
  if (provider.is_blocked !== undefined) dbData.admin_blocked = provider.is_blocked
  if (provider.admin_block_reason !== undefined) dbData.admin_block_reason = provider.admin_block_reason
  if (provider.provider_last_seen_at !== undefined) dbData.provider_last_seen_at = provider.provider_last_seen_at
  if (provider.provider_active !== undefined) dbData.provider_active = provider.provider_active
  if (provider.notes !== undefined) dbData.notes = provider.notes
  return dbData
}
