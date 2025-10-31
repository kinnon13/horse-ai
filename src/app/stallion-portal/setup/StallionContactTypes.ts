// StallionContactTypes.ts (25 lines) - Single responsibility: Contact interfaces
export interface ContactInfo {
  station_name: string
  contact_name: string
  email: string
  phone: string
  website: string
  location_city: string
  location_state: string
  location_country: string
}

export interface SocialMedia {
  instagram?: string
  facebook?: string
  twitter?: string
}

export interface MediaFiles {
  photos: File[]
  videos: File[]
  documents: File[]
}

export interface LocationInfo {
  address: string
  city: string
  state: string
  country: string
  postal_code: string
  coordinates?: {
    lat: number
    lng: number
  }
}

