// AuditLogger.ts (35 lines) - Single responsibility: Main audit logging logic
import { AuditHelpers } from './AuditHelpers'

export class AuditLogger {
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
    
    if (!AuditHelpers.validateAuditData(userId, eventType, payload)) {
      console.error('Invalid audit data provided')
      return
    }
    
    await AuditHelpers.insertAuditLog(userId, eventType, payload)
  }
}


