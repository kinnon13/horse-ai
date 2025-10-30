// Athlete Event Tracker Types - Single responsibility
export interface CompetitionEvent {
  id: string
  athlete_id: string
  horse_id: string
  event_name: string
  event_date: string
  location: string
  discipline: string
  class: string
  placing: number
  score: number
  notes: string
  created_at: string
  updated_at: string
  prize_money: number
  points_earned: number
  qualification_status: string
  next_event: string
  preparation_notes: string
}