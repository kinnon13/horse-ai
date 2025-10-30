/**
 * SERVICE REQUEST AUDIT LOGGER
 * 
 * PURPOSE:
 * - Logs every service request step for audit trail
 * - Creates conversation_audit entries
 * - Tracks service request decisions
 * 
 * SAFETY:
 * - Every interaction is timestamped
 * - We can prove what service was requested and when
 * - Critical for legal compliance
 */

import { supabase } from '@/lib/supabase'

export class ServiceRequestAuditLogger {
  /**
   * PURPOSE:
   * - Logs every service request step for audit trail
   * - Creates conversation_audit entries
   * - Tracks service request decisions
   * 
   * SAFETY:
   * - Every interaction is timestamped
   * - We can prove what service was requested and when
   * - Critical for legal compliance
   */
  static async logServiceRequest(
    userId: string,
    eventType: string,
    payload: any
  ): Promise<void> {
    
    const { error } = await supabase
      .from('conversation_audit')
      .insert({
        user_id: userId,
        event_type: `service_request.${eventType}`,
        payload: payload,
        created_at: new Date().toISOString()
      })
    
    if (error) {
      console.error('Error logging service request step:', error)
      // Don't throw - logging failures shouldn't break service requests
    }
  }
}



