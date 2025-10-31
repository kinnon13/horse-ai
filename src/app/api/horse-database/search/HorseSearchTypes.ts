export interface HorseSearchParams {
  name?: string
  registrationNumber?: string
  sire?: string
  dam?: string
  breed?: string
  foalYear?: number
}

export interface HorseData {
  name: string
  registrationNumber?: string
  sire?: string
  dam?: string
  breed?: string
  foalYear?: number
  color?: string
  gender?: string
  owner?: string
  breeder?: string
  pedigree?: {
    sire: string
    dam: string
    maternalGrandsire?: string
    paternalGrandsire?: string
  }
  performance?: {
    earnings?: number
    starts?: number
    wins?: number
    places?: number
    shows?: number
  }
  breeding?: {
    offspring?: number
    stakesWinners?: number
    studFee?: number
  }
}




// --- AUTO-ADDED STUB EXPORTS (safe to replace with real code) ---
export function HorseSearchParams(_props?: any): never { throw new Error("Stubbed component used: ./HorseSearchTypes.HorseSearchParams"); }
export function HorseData(_props?: any): never { throw new Error("Stubbed component used: ./HorseSearchTypes.HorseData"); }

