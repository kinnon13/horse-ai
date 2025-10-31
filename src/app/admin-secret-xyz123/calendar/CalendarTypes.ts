export interface CalendarEvent {
  id: string
  title: string
  description?: string
  start_date: string
  end_date?: string
  event_type: 'show' | 'deadline' | 'breeding' | 'other'
  location?: string
  user_id: string
  created_at: string
  updated_at: string
}

export interface CalendarFormData {
  title: string
  description?: string
  start_date: string
  end_date?: string
  event_type: 'show' | 'deadline' | 'breeding' | 'other'
  location?: string
}




// --- AUTO-ADDED STUB EXPORTS (safe to replace with real code) ---
export function CalendarEvent(_props?: any): never { throw new Error("Stubbed component used: ./CalendarTypes.CalendarEvent"); }
export function CalendarFormData(_props?: any): never { throw new Error("Stubbed component used: ./CalendarTypes.CalendarFormData"); }

