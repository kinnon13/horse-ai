export interface HorseLineageSectionProps {
  horses: any[]
  loading: boolean
}

export interface HorseLineageStats {
  totalHorses: number
  horsesWithSire: number
  horsesWithDam: number
  horsesWithBoth: number
}

export interface HorseWithLineage {
  id: string
  horse_name: string
  registered_name?: string
  breed: string
  birth_year?: number
  sire_name?: string
  dam_name?: string
}

export interface LineageStatsCardProps {
  title: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  bgColor: string
  textColor: string
  iconColor: string
}




// --- AUTO-ADDED STUB EXPORTS (safe to replace with real code) ---
export function HorseWithLineage(_props?: any): never { throw new Error("Stubbed component used: ./HorseLineageTypes.HorseWithLineage"); }

// --- AUTO-ADDED STUB EXPORTS (safe to replace with real code) ---
export function HorseLineageSectionProps(_props?: any): never { throw new Error("Stubbed component used: ./HorseLineageTypes.HorseLineageSectionProps"); }

// --- AUTO-ADDED STUB EXPORTS (safe to replace with real code) ---
export function LineageStatsCardProps(_props?: any): never { throw new Error("Stubbed component used: ./HorseLineageTypes.LineageStatsCardProps"); }

// --- AUTO-ADDED STUB EXPORTS (safe to replace with real code) ---
export function HorseLineageStats(_props?: any): never { throw new Error("Stubbed component used: ./HorseLineageTypes.HorseLineageStats"); }

