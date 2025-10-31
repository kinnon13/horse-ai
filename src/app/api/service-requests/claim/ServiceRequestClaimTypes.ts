export interface ProviderClaim {
  id?: string
  provider_id: string
  service_request_id: string
  price_quoted?: number
  notes?: string
  status: 'pending' | 'accepted' | 'rejected'
  created_at?: string
  updated_at?: string
}

export interface ServiceRequest {
  id: string
  status: string
  user_id: string
}




// --- AUTO-ADDED STUB EXPORTS (safe to replace with real code) ---
export function ServiceRequest(_props?: any): never { throw new Error("Stubbed component used: ./ServiceRequestClaimTypes.ServiceRequest"); }
export function ProviderClaim(_props?: any): never { throw new Error("Stubbed component used: ./ServiceRequestClaimTypes.ProviderClaim"); }

