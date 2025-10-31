import { Business } from './BusinessTypes'

export const MOCK_BUSINESSES: Business[] = [
  {
    id: '1',
    business_name: 'Smith Equine Services',
    location: 'Weatherford, TX',
    services: ['Repro', 'Vet', 'Training'],
    contact_info: {
      phone: '(817) 555-0123',
      email: 'info@smith-equine.com',
      website: 'smith-equine.com'
    },
    status: 'taking_clients',
    rating: 4.8,
    description: 'Full-service equine facility specializing in reproduction and training.'
  },
  {
    id: '2',
    business_name: 'Blue Ridge Training Center',
    location: 'Austin, TX',
    services: ['Training', 'Lessons', 'Boarding'],
    contact_info: {
      phone: '(512) 555-0456',
      email: 'contact@blueridge.com',
      website: 'blueridge-training.com'
    },
    status: 'taking_clients',
    rating: 4.6,
    description: 'Professional training facility with experienced instructors.'
  },
  {
    id: '3',
    business_name: 'Hill Country Farrier',
    location: 'San Antonio, TX',
    services: ['Farrier'],
    contact_info: {
      phone: '(210) 555-0789',
      email: 'info@hillcountryfarrier.com'
    },
    status: 'taking_clients',
    rating: 4.9,
    description: 'Certified farrier with 15+ years experience.'
  }
]




