// StallionProfileTypes.ts (45 lines) - Single responsibility: Stallion portal types
import { BaseHorseData, BreedingStats, HealthRecord } from './StallionBaseTypes'
import { StallionStationProfile } from './StallionProfileInterfaces'

export interface StallionProfile {
  id: string; name: string; reg_name?: string; breed: string; color: string
  birth_year: number; yob?: number; sire: string; dam: string
  registration_number: string; stud_fee: number; breeding_fee?: number; breeding_fees?: number
  availability: string; status?: string; breeding_history: string; performance_record: string
  bloodline_notes: string; health_certifications: string[]; performance_data?: PerformanceData[]
  breeding_stats?: BreedingStats; health_records?: HealthRecord[]
  created_at: string; updated_at: string
}

export interface PerformanceData {
  id: string; horse_id: string; event_name: string; event_date: string
  placement: number; total_entries: number; time?: number; score?: number
  discipline: string; location: string; notes?: string
}

export interface StallionProfileStatsProps { station: StallionStationProfile }
export interface StallionProfileActionsProps { onEdit: () => void; onViewStallions: () => void }
export interface StallionProfileContentProps { station: StallionStationProfile; onEdit: () => void; onViewStallions: () => void }
export interface StallionProfileServicesProps { station: StallionStationProfile }
export interface StallionProfileContactProps { station: StallionStationProfile }