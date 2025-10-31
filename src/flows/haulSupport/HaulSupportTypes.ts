// HaulSupportTypes.ts (30 lines) - Single responsibility: Type definitions
export interface HaulSupportPoint {
  id: string
  name: string
  location: string
  contact_info: string
  verified: boolean
  active: boolean
  distance_from_route?: number
  amenities?: string[]
  created_at: string
  updated_at: string
}

export interface HaulSupportIntent {
  origin: string
  destination: string
  horseCount: number
  urgency: 'low' | 'medium' | 'high'
  specialRequirements?: string[]
}


