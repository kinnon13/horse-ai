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

import { OnboardingAuditHelpers } from './OnboardingAuditHelpers'

export class OnboardingAuditLogger {
  static async logOnboardingStep(
    userId: string, 
    eventType: string, 
    payload: any
  ): Promise<void> {
    return OnboardingAuditHelpers.logOnboardingStep(userId, eventType, payload)
  }
}