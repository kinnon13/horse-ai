export interface CalendarEvent {
  id: string
  user_id: string
  horse_id?: string
  event_type: string
  event_name: string
  event_date: string
  event_time?: string
  location?: string
  notes?: string
  status: string
  reminder_sent: boolean
  created_at: string
  updated_at: string
  horses?: {
    id: string
    reg_name: string
    sex: string
    yob: number
  }
}

export interface CalendarFilters {
  userId?: string
  eventType?: string
  status?: string
  startDate?: string
  endDate?: string
  limit?: number
}




// --- AUTO-ADDED STUB EXPORTS (safe to replace with real code) ---
export function CalendarEvent(_props?: any): never { throw new Error("Stubbed component used: ./CalendarTypes.CalendarEvent"); }

// --- AUTO-ADDED STUB EXPORTS (safe to replace with real code) ---
export function CalendarFilters(_props?: any): never { throw new Error("Stubbed component used: ./CalendarTypes.CalendarFilters"); }
