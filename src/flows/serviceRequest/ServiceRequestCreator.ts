/**
 * SERVICE REQUEST CREATOR
 * 
 * PURPOSE:
 * - Creates service request in database with audit trail
 * - Records who requested what service and when
 * 
 * SAFETY:
 * - Every service request is timestamped
 * - We record the source user for audit trail
 * - We never overwrite previous requests
 */

import { supabase } from '@/lib/supabase'
import { ServiceRequestIntent } from './ServiceRequestParser'

export class ServiceRequestCreator {
  /**
   * PURPOSE:
   * - Creates service request in database with audit trail
   * - Records who requested what service and when
   * 
   * SAFETY:
   * - Every service request is timestamped
   * - We record the source user for audit trail
   * - We never overwrite previous requests
   */
  static async createServiceRequest(
    intent: ServiceRequestIntent,
    userId: string,
    horseContext?: string
  ): Promise<{ id: string }> {
    
    const { data, error } = await supabase
      .from('service_requests')
      .insert({
        user_id: userId,
        service_type: intent.serviceType,
        location_city: intent.location.city,
        location_state: intent.location.state,
        urgency: intent.urgency,
        details: intent.details,
        horse_name: intent.horseName,
        status: 'open',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('id')
      .single()
    
    if (error) {
      console.error('Error creating service request:', error)
      throw new Error('Failed to create service request')
    }
    
    return data
  }
}

