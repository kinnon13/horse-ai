import { StallionSetupData } from './StallionSetupTypes'

export function getInitialStallionSetupData(email: string): StallionSetupData {
  return {
    station_name: '',
    contact_name: '',
    email: email,
    phone: '',
    website: '',
    location_city: '',
    location_state: '',
    location_country: 'USA',
    years_in_business: null,
    total_stallions: 0,
    annual_breedings: 0,
    breeding_methods: [],
    services: [],
    ai_services: false,
    live_cover_services: false,
    collection_services: false,
    shipping_services: false,
    mare_care: false,
    foaling_services: false,
    training_services: false,
    boarding_services: false,
    veterinary_services: false,
    farrier_services: false,
    description: '',
    facilities: [],
    amenities: [],
    capacity: 0,
    pricing_structure: '',
    payment_terms: '',
    contracts: [],
    insurance: {
      provider: '',
      policy_number: '',
      coverage_amount: ''
    },
    certifications: [],
    affiliations: [],
    social_media: {},
    photos: [],
    videos: [],
    documents: []
  }
}



