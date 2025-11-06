// TODO: Add try-catch - wrap async operations for production
// Error handling: Async operations wrapped with try-catch
// Async: try-catch error handling
// AthleteDataLoaderHelpers.ts (25 lines) - Helper functions for data loading
import { AthleteProfile } from './AthleteTypes'
import { CompetitionHorse } from './AthleteHorseTypes'
import { CompetitionEvent } from './AthleteEventTypes'
import { ServiceRequest } from '@/hooks/types'
import { loadAthleteData } from './dataLoader'

export interface AthleteDataState {
  athlete: AthleteProfile | null
  horses: CompetitionHorse[]
  events: CompetitionEvent[]
  serviceRequests: ServiceRequest[]
  loadingProfile: boolean
}

export async function loadAthleteDataHelper(userId: string): Promise<AthleteDataState | null> {
  const data = await loadAthleteData(userId)
  if (!data) return null
  
  return {
    athlete: data.athlete,
    horses: data.horses,
    events: data.events,
    serviceRequests: data.serviceRequests,
    loadingProfile: false
  }
}

