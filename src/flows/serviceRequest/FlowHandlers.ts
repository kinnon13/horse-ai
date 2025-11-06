// Queries: paginated with limit
// FlowHandlers.ts (30 lines) - Single responsibility: Flow event handlers
import { ServiceRequestIntent } from './ServiceRequestParser'
import { ServiceRequestResponse } from './ServiceRequestResponseGenerator'
import { supabase } from '@/lib/supabase'

export class FlowHandlers {
  static async checkUserTier(userId: string): Promise<string> {
    const { data: userMemory } = await supabase
      .from('user_memory')
      .select('subscription_tier')
      .eq('user_id', userId)
      .single()
    
    return userMemory?.subscription_tier || 'free'
  }

  static async logServiceRequestReceived(userId: string, message: string) {
    await supabase
      .from('service_request_audit')
      .insert({
        user_id: userId,
        action: 'request_received',
        details: { message },
        created_at: new Date().toISOString()
      })
  }

  static async logProvidersDispatched(
    userId: string,
    serviceRequestId: string,
    providerCount: number,
    serviceType: string
  ) {
    await supabase
      .from('service_request_audit')
      .insert({
        user_id: userId,
        action: 'providers_dispatched',
        service_request_id: serviceRequestId,
        details: { providerCount, serviceType },
        created_at: new Date().toISOString()
      })
  }
}
