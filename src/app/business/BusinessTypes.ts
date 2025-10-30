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

