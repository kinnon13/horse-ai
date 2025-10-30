import { ProducerSetupData } from './ProducerSetupTypes'

export function getInitialProducerSetupData(email: string): ProducerSetupData {
  return {
    business_name: '',
    contact_name: '',
    email: email,
    phone: '',
    website: '',
    location_city: '',
    location_state: '',
    location_country: 'USA',
    years_in_business: null,
    specialties: [],
    breeding_focus: '',
    total_mares: 0,
    total_stallions: 0,
    annual_foals: 0,
    breeding_methods: [],
    taking_clients: true,
    description: '',
    facilities: [],
    services: [],
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



