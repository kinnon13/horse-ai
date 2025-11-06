// Queries: paginated with limit
// AuditLogic.ts (35 lines) - Single responsibility: Audit logging logic
import { supabase } from '@/lib/supabase'

export class AuditLogic {
  static async logEvent(
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

  static async logServiceRequestEvent(
    userId: string,
    eventType: string,
    serviceRequestId: string,
    details: any
  ): Promise<void> {
    await this.logEvent(userId, eventType, {
      service_request_id: serviceRequestId,
      ...details
    })
  }

  static async logUserAction(
    userId: string,
    action: string,
    details: any
  ): Promise<void> {
    await this.logEvent(userId, action, details)
  }
}


