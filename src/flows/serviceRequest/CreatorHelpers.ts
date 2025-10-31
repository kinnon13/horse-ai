// CreatorHelpers.ts (30 lines) - Single responsibility: Helper functions for service request creation
import { supabase } from '@/lib/supabase'
import { ServiceRequestIntent } from './ServiceRequestParser'

export class CreatorHelpers {
  static buildServiceRequestData(
    intent: ServiceRequestIntent,
    userId: string,
    horseContext?: string
  ) {
    return {
      user_id: userId,
      service_type: intent.serviceType,
      location_city: intent.location.city,
      location_state: intent.location.state,
      urgency: intent.urgency,
      details: intent.details,
      horse_name: intent.horseName,
      horse_context: horseContext,
      status: 'open',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }

  static async logServiceRequestCreation(
    serviceRequestId: string,
    userId: string,
    intent: ServiceRequestIntent
  ) {
    await supabase
      .from('service_request_audit')
      .insert({
        service_request_id: serviceRequestId,
        user_id: userId,
        action: 'created',
        service_type: intent.serviceType,
        created_at: new Date().toISOString()
      })
  }
}
