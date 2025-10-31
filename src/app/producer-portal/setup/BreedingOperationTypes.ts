// Breeding operation types and constants
import { BreedingOperationConstants } from './BreedingOperationTypes.service'

// Re-export types for convenience
export type { 
  BreedingOperationStepProps, 
  BreedingOperationFormProps, 
  BreedingOperationActionsProps, 
  BreedingOperationStepState, 
  BreedingOperationStepActions,
  BreedingOperationFormData
} from './BreedingOperationTypes.types'

// Re-export constants
export const BREEDING_SPECIALTIES = BreedingOperationConstants.getSpecialties()
export const BREEDING_METHODS = BreedingOperationConstants.getMethods()


