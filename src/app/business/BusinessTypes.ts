export interface Business {
  id: string
  business_name: string
  location: string
  services: string[]
  contact_info: {
    phone?: string
    email?: string
    website?: string
  }
  status: 'taking_clients' | 'not_taking_clients'
  rating?: number
  description?: string
}




// --- AUTO-ADDED STUB EXPORTS (safe to replace with real code) ---
export function Business(_props?: any): never { throw new Error("Stubbed component used: ./BusinessTypes.Business"); }

