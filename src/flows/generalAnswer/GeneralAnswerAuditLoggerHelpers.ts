// GeneralAnswerAuditLoggerHelpers.ts (30 lines)
import { supabase } from '@/lib/supabase'

export async function logGeneralAnswer(
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

