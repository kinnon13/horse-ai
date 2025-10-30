// Outreach Data Types - Single responsibility
export interface OutreachData {
  id: string
  title: string
  content: string
  status: string
  created_at: string
  updated_at: string
}

export interface OutreachStats {
  total: number
  sent: number
  pending: number
  failed: number
  totalMessages: number
  pendingMessages: number
  sentMessages: number
  repliedMessages: number
  failedMessages: number
  responseRate: number
}

export interface OutreachMessage {
  id: string
  title: string
  content: string
  recipients: string[]
  status: 'draft' | 'sent' | 'failed' | 'pending' | 'replied'
  created_at: string
  sent_at?: string
  template_id?: string
  subject?: string
  target?: string
  type?: string
  horse_name?: string
  event_name?: string
}

export interface ComposeData {
  title: string
  content: string
  recipients: string[]
  template?: string
  scheduled_at?: string
  horse_name?: string
  event_name?: string
  target?: string
  subject?: string
  type?: string
}
