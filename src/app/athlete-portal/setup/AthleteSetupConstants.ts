import { AthleteSetupData } from './AthleteSetupTypes'
import { createEmptyAthleteSetupData } from './AthleteSetupInitializers'

export function getInitialAthleteSetupData(email: string): AthleteSetupData {
  return createEmptyAthleteSetupData(email)
}




