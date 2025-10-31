// ServiceRequestAuditLogger.ts (40 lines) - Single responsibility: Main audit logger
import { AuditLogic } from './AuditLogic'

export class ServiceRequestAuditLogger {
  static async logServiceRequest(
    userId: string,
    eventType: string,
    payload: any
  ): Promise<void> {
    await AuditLogic.logEvent(userId, eventType, payload)
  }

  static async logServiceRequestEvent(
    userId: string,
    eventType: string,
    serviceRequestId: string,
    details: any
  ): Promise<void> {
    await AuditLogic.logServiceRequestEvent(userId, eventType, serviceRequestId, details)
  }

  static async logUserAction(
    userId: string,
    action: string,
    details: any
  ): Promise<void> {
    await AuditLogic.logUserAction(userId, action, details)
  }

  static async logProviderDispatch(
    userId: string,
    serviceRequestId: string,
    providerCount: number
  ): Promise<void> {
    await this.logServiceRequestEvent(userId, 'providers_dispatched', serviceRequestId, {
      provider_count: providerCount
    })
  }
}