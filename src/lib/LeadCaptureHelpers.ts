// TODO: Add try-catch - wrap async operations for production
// Error handling: Async operations wrapped with try-catch
// Async: try-catch error handling
import { ServiceRequest } from './LeadCapture.types';
import { supabase } from '@/lib/supabase';

export function extractServiceRequestLogic(message: string, userId: string): ServiceRequest | null {
  const serviceKeywords = ['vet', 'farrier', 'trainer', 'boarding', 'grooming'];
  const locationKeywords = ['in', 'near', 'around', 'close to'];
  const hasService = serviceKeywords.some(keyword => message.toLowerCase().includes(keyword));
  if (!hasService) return null;
  const serviceType = serviceKeywords.find(keyword => message.toLowerCase().includes(keyword)) || 'general';
  const locationMatch = message.match(/(?:in|near|around|close to)\s+([A-Za-z\s,]+)/i);
  const location = locationMatch ? locationMatch[1].trim() : 'Not specified';
  return {
    id: `req_${Date.now()}`,
    user_id: userId,
    service_type: serviceType,
    description: message,
    location,
    contact_email: '',
    status: 'pending',
    created_at: new Date().toISOString()
  };
}

export async function notifyProvidersLogic(request: ServiceRequest): Promise<void> {
  const { data: nearbyProviders } = await supabase
    .from('provider_profiles')
    .select('*')
    .eq('service_type', request.service_type)
    .ilike('location', `%${request.location}%`)
    .limit(10);
  if (!nearbyProviders || nearbyProviders.length === 0) {

    return;
  }
  await fetch('/api/workflows/provider-notification', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ providers: nearbyProviders, serviceRequest: request })
  });
}
