import { HorseSearchParams, HorseData } from './HorseSearchTypes'

export async function searchHorseDatabase(params: HorseSearchParams): Promise<HorseData[]> {
  const mockHorses: HorseData[] = [
    {
      name: params.name || 'Sample Horse',
      registrationNumber: params.registrationNumber || '12345',
      sire: params.sire || 'Sample Sire',
      dam: params.dam || 'Sample Dam',
      breed: params.breed || 'Quarter Horse',
      foalYear: params.foalYear || 2020,
      color: 'Bay',
      gender: 'Stallion',
      owner: 'Sample Owner',
      breeder: 'Sample Breeder',
      pedigree: {
        sire: params.sire || 'Sample Sire',
        dam: params.dam || 'Sample Dam',
        maternalGrandsire: 'Sample Maternal Grandsire',
        paternalGrandsire: 'Sample Paternal Grandsire'
      },
      performance: {
        earnings: 50000,
        starts: 10,
        wins: 5,
        places: 3,
        shows: 2
      },
      breeding: {
        offspring: 25,
        stakesWinners: 3,
        studFee: 2500
      }
    }
  ]

  return mockHorses.filter(horse => {
    if (params.name && !horse.name.toLowerCase().includes(params.name.toLowerCase())) return false
    if (params.registrationNumber && horse.registrationNumber !== params.registrationNumber) return false
    if (params.sire && !horse.sire?.toLowerCase().includes(params.sire.toLowerCase())) return false
    if (params.dam && !horse.dam?.toLowerCase().includes(params.dam.toLowerCase())) return false
    if (params.breed && !horse.breed?.toLowerCase().includes(params.breed.toLowerCase())) return false
    if (params.foalYear && horse.foalYear !== params.foalYear) return false
    return true
  })
}