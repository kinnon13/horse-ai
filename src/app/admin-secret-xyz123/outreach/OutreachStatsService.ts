import { OutreachStats, OutreachMessage } from './OutreachData'
import { fetchOutreachMessages } from './OutreachMessageService'

export async function fetchOutreachStats(): Promise<OutreachStats> {
  const messages: OutreachMessage[] = await fetchOutreachMessages()
  const totalMessages = messages.length
  const pendingMessages = messages.filter(m => m.status === 'pending').length
  const sentMessages = messages.filter(m => m.status === 'sent').length
  const repliedMessages = messages.filter(m => m.status === 'replied').length
  const failedMessages = messages.filter(m => m.status === 'failed').length
  const responseRate = totalMessages > 0 ? (repliedMessages / totalMessages) * 100 : 0

  return {
    total: totalMessages,
    sent: sentMessages,
    pending: pendingMessages,
    failed: failedMessages,
    totalMessages,
    pendingMessages,
    sentMessages,
    repliedMessages,
    failedMessages,
    responseRate: Math.round(responseRate * 10) / 10
  }
}



