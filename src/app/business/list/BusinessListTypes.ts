export interface BusinessFormData {
  business_name: string
  location: string
  services: string[]
  contact_info: {
    phone: string
    email: string
    website: string
  }
  taking_clients: boolean
  description: string
}

export const AVAILABLE_SERVICES = [
  'Training',
  'Lessons',
  'Horse Sales',
  'Breeding',
  'Veterinary',
  'Farrier',
  'Equipment',
  'Boarding',
  'Transportation',
  'Event Planning',
  'Photography',
  'Other'
]

