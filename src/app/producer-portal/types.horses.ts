// Producer Portal Horse Types - Single responsibility
export interface StallionProfile {
  id: string
  operation_id: string
  name: string
  breed: string
  age: number
  color: string
  bloodline: string
  breeding_fees: number
  created_at: string
  updated_at: string
}

export interface MareProfile {
  id: string
  operation_id: string
  name: string
  breed: string
  age: number
  color: string
  bloodline: string
  created_at: string
  updated_at: string
}
