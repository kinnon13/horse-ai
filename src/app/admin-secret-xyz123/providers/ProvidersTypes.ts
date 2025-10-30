export interface Provider {
  id: string
  business_name: string
  contact_name: string | null
  phone: string | null
  email: string | null
  service_type: string
  service_types: string[]
  specialty: string | null
  city: string | null
  state: string | null
  location_city: string | null
  location_state: string | null
  verified: boolean
  is_verified: boolean
  sponsored: boolean
  admin_blocked: boolean
  is_blocked: boolean
  admin_block_reason: string | null
  provider_last_seen_at: string | null
  provider_active: boolean
  relationship_type: string
  notes: string | null
  rating_safe: number
  rating_reliable: number
  created_at: string
  updated_at: string
}

export interface ProviderFormData {
  business_name: string
  contact_name: string
  email: string
  phone: string
  service_types: string[]
  location_city: string
  location_state: string
}




// --- AUTO-ADDED STUB EXPORTS (safe to replace with real code) ---
export function Provider(_props?: any): never { throw new Error("Stubbed component used: ./ProvidersTypes.Provider"); }

// --- AUTO-ADDED STUB EXPORTS (safe to replace with real code) ---
export function ProviderFormData(_props?: any): never { throw new Error("Stubbed component used: ./ProvidersTypes.ProviderFormData"); }
