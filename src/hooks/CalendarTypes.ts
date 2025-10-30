export interface CalendarEvent {
  id: string
  user_id: string
  event_type: 'reminder' | 'show_date' | 'haul_date' | 'vet_appointment' | 'farrier_appointment' | 'entry_deadline'
  event_title: string
  event_date: string
  location_city: string | null
  location_state: string | null
  horse_id: string | null
  reminder_time: string | null
  reminded_at: string | null
  status: 'pending' | 'reminded' | 'completed' | 'canceled'
  notes: string | null
  created_at: string
  horses?: {
    id: string
    reg_name: string
    sex: string | null
    yob: string | null
  }
}

export interface CalendarFilters {
  user_id?: string
  event_type?: string
  status?: string
  start_date?: string
  end_date?: string
  limit?: number
}

export interface CalendarState {
  events: CalendarEvent[]
  loading: boolean
  error: string | null
  selectedSlot: string | null
  pendingRequest: boolean
}

export interface CalendarActions {
  fetchEvents: () => Promise<void>
  createEvent: (event: Omit<CalendarEvent, 'id' | 'created_at'>) => Promise<void>
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => Promise<void>
  deleteEvent: (id: string) => Promise<void>
  selectSlot: (slot: string | null) => void
  requestBooking: (slot: string, eventData: any) => Promise<void>
  cancelBooking: (id: string) => Promise<void>
}

