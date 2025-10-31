import { 
  ContactInfo, 
  LocationInfo, 
  BusinessInfo, 
  ServiceFlags, 
  FacilityInfo, 
  BusinessDetails, 
  SocialMedia, 
  MediaFiles 
} from './StallionSetupBaseTypes'

export interface StallionSetupData extends 
  ContactInfo, 
  BusinessInfo, 
  FacilityInfo, 
  BusinessDetails {
  address: string
  city: string
  state: string
  country: string
  postal_code: string
  coordinates?: { lat: number; lng: number }
  ai_services: boolean
  live_cover_services: boolean
  collection_services: boolean
  shipping_services: boolean
  mare_care: boolean
  foaling_services: boolean
  training_services: boolean
  boarding_services: boolean
  veterinary_services: boolean
  farrier_services: boolean
  social_media: SocialMedia
  photos: File[]
  videos: File[]
  documents: File[]
}