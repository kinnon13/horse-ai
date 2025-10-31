// ProducerTypes.ts (30 lines) - Single responsibility: Core producer types
import type { StallionProfile, MareProfile } from './ProducerHorseProfiles'

export interface ProducerProfile {
  id: string
  name: string
  email: string
  phone?: string
  location?: string
  business_type: 'breeding' | 'training' | 'boarding' | 'all'
  years_in_business: number
  breeding_operation?: BreedingOperation
  created_at: string
  updated_at: string
}

export interface BreedingOperation {
  id: string
  producer_id: string
  operation_name: string
  location: string
  years_active: number
  specialties: string[]
  breeding_policies: BreedingPolicy[]
  stallions: StallionProfile[]
  mares: MareProfile[]
  created_at: string
  updated_at: string
}

export interface BreedingPolicy {
  id: string
  operation_id: string
  policy_type: 'breeding_fees' | 'health_requirements' | 'contract_terms'
  title: string
  description: string
  is_active: boolean
  created_at: string
  updated_at: string
}