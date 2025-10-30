// Re-export utility classes for convenience
export { OutreachMessageUtils } from './OutreachMessageUtils'
export { OutreachStatsUtils } from './OutreachStatsUtils'
import { OutreachMessageUtils } from './OutreachMessageUtils'

// Add missing methods for backward compatibility
export const OutreachUtils = {
  getInitialMessages: () => OutreachMessageUtils.getInitialMessages(),
  getTemplate: (templateId: string) => OutreachMessageUtils.getTemplate(templateId),
  updateMessage: (messageId: string, updates: any) => OutreachMessageUtils.updateMessage(messageId, updates),
  createNewMessage: () => OutreachMessageUtils.createMessage({ subject: '', body: '', recipient: '' }),
  getInitialComposeData: () => ({ subject: '', body: '', recipient: '' }),
  getEditData: (messageId: string) => OutreachMessageUtils.getInitialMessages().find(m => m.id === messageId),
  calculateStats: (messages: any[]) => ({
    total: messages.length,
    sent: messages.filter(m => m.status === 'sent').length,
    opened: messages.filter(m => m.opened_at).length,
    clicked: messages.filter(m => m.clicked_at).length
  })
}