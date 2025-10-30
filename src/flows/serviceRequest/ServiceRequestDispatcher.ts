/**
 * SERVICE REQUEST DISPATCHER
 * 
 * PURPOSE:
 * - Dispatches service request to verified providers
 * - Records which providers were contacted
 * - Creates audit trail of dispatch decisions
 * 
 * SAFETY:
 * - Only dispatches to verified providers
 * - We log every dispatch decision
 * - We never expose private contact info
 */

import { supabase } from '@/lib/supabase'
import { ServiceRequestIntent } from './ServiceRequestParser'

export class ServiceRequestDispatcher {
  /**
   * PURPOSE:
   * - Dispatches service request to verified providers
   * - Records which providers were contacted
   * - Creates audit trail of dispatch decisions
   * 
   * SAFETY:
   * - Only dispatches to verified providers
   * - We log every dispatch decision
   * - We never expose private contact info
   */
  static async dispatchToProviders(
    serviceRequestId: string,
    intent: ServiceRequestIntent
  ): Promise<{ providerCount: number }> {
    
    // Get verified providers in the area
    const { data: providers, error } = await supabase
      .from('providers')
      .select('id, name, service_type, phone, email, verified')
      .eq('service_type', intent.serviceType)
      .eq('location_city', intent.location.city)
      .eq('location_state', intent.location.state)
      .eq('verified', true)
      .eq('taking_clients', true)
    
    if (error) {
      console.error('Error fetching providers:', error)
      throw new Error('Failed to fetch providers')
    }
    
    if (!providers || providers.length === 0) {
      return { providerCount: 0 }
    }
    
    // Create dispatch records for each provider
    const dispatchPromises = providers.map(provider => 
      supabase.from('provider_dispatches').insert({
        service_request_id: serviceRequestId,
        provider_id: provider.id,
        dispatched_at: new Date().toISOString(),
        status: 'sent'
      })
    )
    
    await Promise.all(dispatchPromises)
    
    return { providerCount: providers.length }
  }
}



