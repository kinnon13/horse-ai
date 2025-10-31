// LeadCaptureExtractor.ts (28 lines) - Service request extraction logic
import { supabase } from '@/lib/supabase-client'
import { ServiceRequest } from './LeadCaptureTypes'

export async function extractServiceRequests(message: string, userId: string): Promise<ServiceRequest[]> {
  const requests: ServiceRequest[] = []
  const serviceKeywords = ['vet', 'farrier', 'trainer', 'boarding', 'grooming', 'transport']
  const locationKeywords = ['in', 'near', 'around', 'at']
  
  const words = message.toLowerCase().split(' ')
  let currentService = ''
  let currentLocation = ''
  
  for (let i = 0; i < words.length; i++) {
    if (serviceKeywords.includes(words[i])) currentService = words[i]
    if (locationKeywords.includes(words[i]) && i + 1 < words.length) {
      currentLocation = words[i + 1]
    }
  }
  
  if (currentService && currentLocation) {
    const request: ServiceRequest = {
      id: 'req_' + Date.now(),
      user_id: userId,
      service_type: currentService,
      description: message,
      location: currentLocation,
      status: 'pending',
      created_at: new Date().toISOString()
    }
    
    await supabase.from('service_requests').insert(request)
    requests.push(request)
  }
  
  return requests
}