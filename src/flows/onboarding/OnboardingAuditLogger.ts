/**
 * ONBOARDING AUDIT LOGGER
 * 
 * PURPOSE:
 * - Logs every onboarding step for audit trail
 * - Creates conversation_audit entries
 * - Tracks user decisions and consent
 * 
 * SAFETY:
 * - Every interaction is timestamped
 * - We can prove what we asked and when
 * - Critical for legal compliance
 */

import { supabase } from '@/lib/supabase'

export class OnboardingAuditLogger {
  /**
   * PURPOSE:
   * - Logs every onboarding step for audit trail
   * - Creates conversation_audit entries
   * - Tracks user decisions and consent
   * 
   * SAFETY:
   * - Every interaction is timestamped
   * - We can prove what we asked and when
   * - Critical for legal compliance
   */
  static async logOnboardingStep(
    userId: string, 
    eventType: string, 
    payload: any
  ): Promise<void> {
    const { error } = await supabase
      .from('conversation_audit')
      .insert({
        user_id: userId,
        event_type: `onboarding.${eventType}`,
        payload: payload,
        created_at: new Date().toISOString()
      })
    
    if (error) {
      console.error('Error logging onboarding step:', error)
    }
  }
}

