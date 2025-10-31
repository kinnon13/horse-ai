// CalendarErrorHandlers.ts - Error handling utilities for calendar operations
export function handleCalendarError(operation: string, error: any) {
  console.error(`Error ${operation}:`, error)
  alert(`Failed to ${operation}`)
}

export function showSuccessMessage(operation: string) {
  alert(`${operation} successfully!`)
}


