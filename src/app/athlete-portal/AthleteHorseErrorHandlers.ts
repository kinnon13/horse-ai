// AthleteHorseErrorHandlers.ts - Error handling utilities for athlete horse operations
export function handleHorseError(operation: string, error: any) {
  console.error(`Error ${operation}:`, error)
  // Could add user notification here
}

export function confirmHorseDeletion(): boolean {
  return confirm('Are you sure you want to delete this horse?')
}


