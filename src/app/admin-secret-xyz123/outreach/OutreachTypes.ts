export interface OutreachMessage {
  id: string
  type: string
  target: string
  template: string
  status: string
  created_at: string
  horse_name?: string | null
  event_name?: string | null
  subject?: string
  content?: string
}

export interface ComposeData {
  type: string
  target: string
  template: string
  subject: string
  content: string
  horse_name: string
  event_name: string
}

export interface OutreachTemplate {
  id: string
  name: string
  type: string
  subject: string
  content: string
  variables: string[]
}