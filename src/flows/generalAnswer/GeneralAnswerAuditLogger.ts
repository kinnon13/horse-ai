/**
 * GENERAL ANSWER AUDIT LOGGER
 * 
 * PURPOSE:
 * - Logs every general answer step for audit trail
 * - Creates conversation_audit entries
 * - Tracks general answer decisions
 * 
 * SAFETY:
 * - Every interaction is timestamped
 * - We can prove what general answer was provided and when
 * - Critical for legal compliance
 */

import { supabase } from '@/lib/supabase'

export class GeneralAnswerAuditLogger {
  /**
   * PURPOSE:
   * - Logs every general answer step for audit trail
   * - Creates conversation_audit entries
   * - Tracks general answer decisions
   * 
   * SAFETY:
   * - Every interaction is timestamped
   * - We can prove what general answer was provided and when
   * - Critical for legal compliance
   */
  static async logGeneralAnswer(
    userId: string,
    eventType: string,
    payload: any
  ): Promise<void> {
    
    const { error } = await supabase
      .from('conversation_audit')
      .insert({
        user_id: userId,
        event_type: `general_answer.${eventType}`,
        payload: payload,
        created_at: new Date().toISOString()
      })
    
    if (error) {
      console.error('Error logging general answer step:', error)
      // Don't throw - logging failures shouldn't break general answers
    }
  }
}



