// StallionSetupHelpers.ts (15 lines) - Helper functions for stallion setup
import { StallionSetupData } from './StallionSetupTypes'

export function createEmptyInsurance() {
  return {
    provider: '',
    policy_number: '',
    coverage_amount: ''
  }
}

export function createEmptySocialMedia() {
  return {}
}

export function createEmptyArrays() {
  return {
    photos: [],
    videos: [],
    documents: []
  }
}
