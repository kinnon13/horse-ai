// GeneralAnswerAuditLogger.ts (50 lines)
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

import { logGeneralAnswer } from './GeneralAnswerAuditLoggerHelpers'

export class GeneralAnswerAuditLogger {
  static async logGeneralAnswer(
    userId: string,
    eventType: string,
    payload: any
  ): Promise<void> {
    return logGeneralAnswer(userId, eventType, payload)
  }
}