import { HorseLineageStats } from './HorseLineageTypes'

export function useHorseLineageData(horses: any[]): HorseLineageStats {
  const totalHorses = horses.length
  const horsesWithSire = horses.filter(horse => horse.sire_name).length
  const horsesWithDam = horses.filter(horse => horse.dam_name).length
  const horsesWithBoth = horses.filter(horse => horse.sire_name && horse.dam_name).length

  return {
    totalHorses,
    horsesWithSire,
    horsesWithDam,
    horsesWithBoth
  }
}

