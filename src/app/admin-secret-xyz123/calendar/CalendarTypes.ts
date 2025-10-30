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

