// AuditHelpers.ts (35 lines) - Single responsibility: Audit helper functions
import { supabase } from '@/lib/supabase'

export class AuditHelpers {
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
  static async insertAuditLog(
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

  static formatAuditPayload(eventType: string, data: any): any {
    return {
      event_type: eventType,
      timestamp: new Date().toISOString(),
      data: data
    }
  }

  static validateAuditData(userId: string, eventType: string, payload: any): boolean {
    return !!(userId && eventType && payload)
  }
}


