// ClaimsErrorHandlers.ts - Error handling utilities for claims operations
export function handleClaimsError(operation: string, error: any) {
  console.error(`Error ${operation}:`, error)
  alert(`Failed to ${operation}`)
}

export function showClaimsSuccessMessage(operation: string) {
  alert(`Claim ${operation} successfully!`)
}


