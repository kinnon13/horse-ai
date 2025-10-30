/**
 * HAUL SUPPORT AUDIT LOGGER
 * 
 * PURPOSE:
 * - Logs every haul support step for audit trail
 * - Creates conversation_audit entries
 * - Tracks haul support decisions
 * 
 * SAFETY:
 * - Every interaction is timestamped
 * - We can prove what haul support was provided and when
 * - Critical for legal compliance
 */

import { supabase } from '@/lib/supabase'

export class HaulSupportAuditLogger {
  /**
   * PURPOSE:
   * - Logs every haul support step for audit trail
   * - Creates conversation_audit entries
   * - Tracks haul support decisions
   * 
   * SAFETY:
   * - Every interaction is timestamped
   * - We can prove what haul support was provided and when
   * - Critical for legal compliance
   */
  static async logHaulSupport(
    userId: string,
    eventType: string,
    payload: any
  ): Promise<void> {
    
    const { error } = await supabase
      .from('conversation_audit')
      .insert({
        user_id: userId,
        event_type: `haul_support.${eventType}`,
        payload: payload,
        created_at: new Date().toISOString()
      })
    
    if (error) {
      console.error('Error logging haul support step:', error)
      // Don't throw - logging failures shouldn't break haul support
    }
  }
}



