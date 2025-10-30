export interface HorseSearchParams {
  name: string
  registrationNumber: string
  sire: string
  dam: string
}

export interface HorseSearchResult {
  id: string
  name: string
  registered_name?: string
  registration_number?: string
  breed: string
  year_born: number
  sex: string
  color: string
  sire?: string
  dam?: string
  stud_fee?: number
  location?: string
  achievements?: string[]
  offspring_count?: number
  earnings?: number
}

export interface HorseDatabaseSearchProps {
  onHorseFound?: (horseData: HorseSearchResult) => void
}

export type SearchType = 'name' | 'registration' | 'pedigree'

