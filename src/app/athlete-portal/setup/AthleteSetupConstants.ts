import { AthleteSetupData } from './AthleteSetupTypes'

export function getInitialAthleteSetupData(email: string): AthleteSetupData {
  return {
    rider_name: '',
    email: email,
    phone: '',
    location_city: '',
    location_state: '',
    location_country: 'USA',
    age: null,
    years_riding: null,
    primary_disciplines: [],
    skill_level: '',
    competition_level: '',
    preferred_events: [],
    travel_radius_miles: 100,
    owns_horses: 0,
    leases_horses: 0,
    rides_for_others: false,
    bio: '',
    achievements: '',
    goals: '',
    availability: [],
    preferred_training_times: [],
    budget_range: '',
    transportation: false,
    equipment: [],
    sponsors: [],
    social_media: {},
    emergency_contact: {
      name: '',
      phone: '',
      relationship: ''
    },
    insurance_info: {
      provider: '',
      policy_number: '',
      expiration_date: ''
    },
    medical_info: {
      allergies: '',
      medications: '',
      conditions: ''
    },
    profile_photo: null,
    resume_file: null
  }
}



