// Producer Portal Core Types - Single responsibility
export interface ProducerProfile {
  id: string
  name: string
  email: string
  phone?: string
  location?: string
  business_type: 'breeding' | 'training' | 'boarding' | 'all'
  years_in_business: number
  created_at: string
  updated_at: string
}

export interface BreedingOperation {
  id: string
  producer_id: string
  operation_name: string
  location: string
  years_active: number
  created_at: string
  updated_at: string
}
