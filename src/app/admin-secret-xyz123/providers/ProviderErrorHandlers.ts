// ProviderErrorHandlers.ts - Error handling utilities for provider operations
export function handleProviderError(operation: string, error: any) {
  console.error(`Error ${operation}:`, error)
  alert(`Failed to ${operation}`)
}

export function showProviderSuccessMessage(operation: string) {
  alert(`Provider ${operation} successfully!`)
}


