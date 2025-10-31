// Producer Performance Data Types - Single responsibility
export interface PerformanceData {
  id: string
  horse_id: string
  event_name: string
  event_date: string
  placement?: number
  earnings?: number
  notes?: string
  created_at: string
  updated_at: string
}
