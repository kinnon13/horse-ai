// Compose Data Types - Single responsibility
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
