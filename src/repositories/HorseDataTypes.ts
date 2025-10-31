// HorseDataTypes.ts (25 lines) - Single responsibility: Horse data type definitions
export interface Horse {
  id: string
  user_id: string
  name: string
  breed: string
  age: number
  notes?: string
  created_at: string
}

export interface Vet {
  id: string
  name: string
  location: string
  phone: string
  specialties: string[]
  rating: number
}

export interface Service {
  id: string
  name: string
  type: 'vet' | 'farrier' | 'trainer' | 'boarding'
  location: string
  phone: string
  rating: number
}
