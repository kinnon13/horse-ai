import { OutreachMessage, OutreachStats } from './OutreachData'

export class OutreachData {
  static calculateStats(messages: OutreachMessage[]): OutreachStats {
    const totalMessages = messages.length
    const pendingMessages = messages.filter(m => m.status === 'pending').length
    const sentMessages = messages.filter(m => m.status === 'sent').length
    const repliedMessages = messages.filter(m => m.status === 'replied').length
    const failedMessages = messages.filter(m => m.status === 'failed').length
    const responseRate = totalMessages > 0 ? 
      Math.round((repliedMessages / totalMessages) * 100 * 10) / 10 : 0

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
      responseRate
    }
  }
}




// --- AUTO-ADDED STUB EXPORTS (safe to replace with real code) ---
export function OutreachStatsCalculator(_props?: any): never { throw new Error("Stubbed component used: ./OutreachStatsCalculator.OutreachStatsCalculator"); }
