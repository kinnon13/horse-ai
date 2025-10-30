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
  created_at?: string
  updated_at?: string
}

// --- AUTO-ADDED STUB EXPORTS (safe to replace with real code) ---
export function OutreachMessage(_props?: any): never { throw new Error("Stubbed component used: ./OutreachTypes.OutreachMessage"); }

// --- AUTO-ADDED STUB EXPORTS (safe to replace with real code) ---
export function OutreachStats(_props?: any): never { throw new Error("Stubbed component used: ./OutreachTypes.OutreachStats"); }

// --- AUTO-ADDED STUB EXPORTS (safe to replace with real code) ---
export function OutreachTemplate(_props?: any): never { throw new Error("Stubbed component used: ./OutreachTypes.OutreachTemplate"); }

// --- AUTO-ADDED STUB EXPORTS (safe to replace with real code) ---
export function ComposeData(_props?: any): never { throw new Error("Stubbed component used: ./OutreachTypes.ComposeData"); }
