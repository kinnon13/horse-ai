import { StallionSetupData } from './StallionSetupTypes'
import { createEmptyStallionSetupData } from './StallionSetupInitializers'

export function getInitialStallionSetupData(email: string): StallionSetupData {
  return createEmptyStallionSetupData(email)
}




