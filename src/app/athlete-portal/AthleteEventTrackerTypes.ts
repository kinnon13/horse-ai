export interface CompetitionEvent {
  id: string
  athlete_id: string
  horse_id: string
  event_name: string
  event_date: string
  location_city: string | null
  location_state: string | null
  discipline: string
  competition_level: string | null
  placement: number | null
  earnings: number
  notes: string | null
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

