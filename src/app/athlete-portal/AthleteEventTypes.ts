// AthleteEventTypes.ts - Single responsibility: Event-related types
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
  placing?: number
  total_entries?: number
  time?: number
  score?: number
  prize_money?: number
  points_earned?: number
  earnings?: number
  notes?: string
  created_at: string
  updated_at: string
}

export interface EventRegistration {
  id: string
  event_id: string
  athlete_id: string
  horse_id: string
  registration_date: string
  status: 'pending' | 'confirmed' | 'cancelled'
  entry_fee: number
  notes?: string
  created_at: string
  updated_at: string
}

export interface EventResults {
  id: string
  event_id: string
  athlete_id: string
  horse_id: string
  placement: number
  total_entries: number
  time?: number
  score?: number
  points_earned: number
  prize_money?: number
  notes?: string
  created_at: string
  updated_at: string
}