import { OutreachMessage, ComposeData } from './OutreachTypes'

export interface OutreachStats {
  totalMessages: number
  pendingMessages: number
  sentMessages: number
  repliedMessages: number
  failedMessages: number
  responseRate: number
}

export class OutreachData {
  static createNewMessage(composeData: ComposeData): OutreachMessage {
    return {
      id: Date.now().toString(),
      type: composeData.type,
      target: composeData.target,
      template: composeData.template,
      status: 'pending',
      created_at: new Date().toISOString(),
      subject: composeData.subject,
      content: composeData.content,
      horse_name: composeData.horse_name || null,
      event_name: composeData.event_name || null
    }
  }

  static getEditData(message: OutreachMessage): ComposeData {
    return {
      type: message.type,
      target: message.target,
      template: message.template,
      subject: message.subject || '',
      content: message.content || '',
      horse_name: message.horse_name || '',
      event_name: message.event_name || ''
    }
  }

  static updateMessage(message: OutreachMessage, composeData: ComposeData): OutreachMessage {
    return {
      ...message,
      type: composeData.type,
      target: composeData.target,
      template: composeData.template,
      subject: composeData.subject,
      content: composeData.content,
      horse_name: composeData.horse_name || null,
      event_name: composeData.event_name || null
    }
  }
}

