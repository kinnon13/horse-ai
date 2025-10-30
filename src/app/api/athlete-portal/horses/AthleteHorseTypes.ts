export interface AthleteHorse {
  id?: string
  horse_name: string
  breed: string
  year_born: number
  sex: string
  color: string
  athlete_id: string
  partnership_type: 'owned' | 'leased' | 'training'
  registration_number?: string
  sire?: string
  dam?: string
  notes?: string
  created_at?: string
  updated_at?: string
}

