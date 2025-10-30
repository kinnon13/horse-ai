// Outreach Service - Single responsibility
export class OutreachService {
  static async getInitialMessages() {
    return []
  }

  static async getTemplate(templateId: string) {
    return { id: templateId, content: 'Template content' }
  }

  static async updateMessage(messageId: string, updates: any) {
    return { id: messageId, ...updates }
  }

  static async createNewMessage(messageData: any) {
    return { id: 'msg_' + Date.now(), ...messageData }
  }

  static async getInitialComposeData() {
    return {
      title: '',
      content: '',
      recipients: [],
      template: '',
      scheduled_at: '',
      horse_name: '',
      event_name: '',
      target: '',
      subject: '',
      type: ''
    }
  }

  static async getEditData(messageId: string) {
    return {
      id: messageId,
      title: 'Edit Message',
      content: 'Message content',
      recipients: [],
      status: 'draft'
    }
  }

  static async calculateStats() {
    return {
      total: 0,
      sent: 0,
      pending: 0,
      failed: 0,
      totalMessages: 0,
      pendingMessages: 0,
      sentMessages: 0,
      repliedMessages: 0,
      failedMessages: 0,
      responseRate: 0
    }
  }
}