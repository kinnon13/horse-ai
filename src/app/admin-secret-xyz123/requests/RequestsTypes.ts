export interface DispatchStats {
  totalRequests: number
  openRequests: number
  claimedRequests: number
  completedRequests: number
  totalProviders: number
  verifiedProviders: number
}

export interface ServiceRequest {
  id: string
  user_id: string
  service_type: string
  description: string
  location_city: string
  location_state: string
  status: string
  created_at: string
  updated_at: string
  user_name?: string
  user_email?: string
  provider_claims?: any[]
}




// --- AUTO-ADDED STUB EXPORTS (safe to replace with real code) ---
export function ServiceRequest(_props?: any): never { throw new Error("Stubbed component used: ./RequestsTypes.ServiceRequest"); }

// --- AUTO-ADDED STUB EXPORTS (safe to replace with real code) ---
export function DispatchStats(_props?: any): never { throw new Error("Stubbed component used: ./RequestsTypes.DispatchStats"); }
