export class OutreachStatsUtils {
  static calculateOpenRate(sent: number, opened: number): number {
    return sent > 0 ? (opened / sent) * 100 : 0
  }

  static calculateClickRate(clicked: number, opened: number): number {
    return opened > 0 ? (clicked / opened) * 100 : 0
  }

  static calculateResponseRate(responses: number, sent: number): number {
    return sent > 0 ? (responses / sent) * 100 : 0
  }

  static getTotalSent(messages: any[]): number {
    return messages.filter(m => m.status === 'sent').length
  }

  static getTotalOpened(messages: any[]): number {
    return messages.filter(m => m.opened_at).length
  }

  static getTotalClicked(messages: any[]): number {
    return messages.filter(m => m.clicked_at).length
  }
}