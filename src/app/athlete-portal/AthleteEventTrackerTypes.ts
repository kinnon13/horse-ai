// Athlete Event Tracker Types - Single responsibility
export interface CompetitionEvent {
  id: string
  athlete_id: string
  horse_id: string
  event_name: string
  event_date: string
  location: string
  discipline: string
  class?: string
  placement?: number
  total_entries?: number
  time?: number
  score?: number
  points_earned?: number
  prize_money?: number
  notes?: string
  created_at: string
  updated_at: string
}

export interface AthleteEventTrackerSectionProps {
  events: CompetitionEvent[]
  horses: any[]
  loading: boolean
  onAddEvent: () => void
  onEditEvent: (event: CompetitionEvent) => void
  onDeleteEvent: (eventId: string) => void
}