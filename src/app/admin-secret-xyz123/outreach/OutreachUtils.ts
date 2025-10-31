// Re-export utility classes for convenience
export { OutreachMessageUtils } from './OutreachMessageUtils'
export { OutreachStatsUtils } from './OutreachStatsUtils'
import { OutreachMessageUtils } from './OutreachMessageUtils'

// Add missing methods for backward compatibility
export const OutreachUtils = {
  getInitialMessages: () => OutreachMessageUtils.getInitialMessages(),
  getTemplate: (templateId: string) => OutreachMessageUtils.getTemplate(templateId),
  updateMessage: (messageId: string, updates: any) => OutreachMessageUtils.updateMessage(messageId, updates),
  createNewMessage: (composeData: any) => OutreachMessageUtils.createMessage(composeData),
  getInitialComposeData: () => ({ title: '', content: '', recipients: [] as string[] }),
  getEditData: (message: any) => ({
    title: message.title || '',
    content: message.content || '',
    recipients: message.recipients || [],
    template: message.template_id,
    scheduled_at: message.sent_at,
    horse_name: message.horse_name,
    event_name: message.event_name,
    target: message.target,
    subject: message.subject,
    type: message.type
  }),
  calculateStats: (messages: any[]) => ({
    total: messages.length,
    sent: messages.filter(m => m.status === 'sent').length,
    pending: messages.filter(m => m.status === 'pending').length,
    failed: messages.filter(m => m.status === 'failed').length,
    totalMessages: messages.length,
    pendingMessages: messages.filter(m => m.status === 'pending').length,
    sentMessages: messages.filter(m => m.status === 'sent').length,
    repliedMessages: messages.filter(m => m.replied).length,
    failedMessages: messages.filter(m => m.status === 'failed').length,
    responseRate: messages.length > 0 ? (messages.filter(m => m.replied).length / messages.length) * 100 : 0
  })
}