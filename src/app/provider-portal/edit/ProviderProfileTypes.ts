export namespace ProviderProfileTypes {
  export interface Provider {
    id: string
    user_id: string
    business_name?: string
    business_type?: string
    services_offered?: string[]
    service_areas?: string[]
    phone?: string
    email?: string
    website?: string
    description?: string
    years_experience?: number
    certifications?: string[]
    insurance_info?: string
    is_verified?: boolean
    created_at?: string
    updated_at?: string
  }

  export interface ProviderFormData {
    business_name: string
    business_type: string
    services_offered: string[]
    service_areas: string[]
    phone: string
    email: string
    website: string
    description: string
    years_experience: number
    certifications: string[]
    insurance_info: string
  }
}




// --- AUTO-ADDED STUB EXPORTS (safe to replace with real code) ---
export function ProviderProfileTypes(_props?: any): never { throw new Error("Stubbed component used: ./ProviderProfileTypes.ProviderProfileTypes"); }
