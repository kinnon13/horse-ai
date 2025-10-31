// HaulSupportValidationHelpers.ts - Validation helper functions
export function validateRequiredString(value: any, fieldName: string): string {
  if (!value?.trim()) {
    throw new Error(`${fieldName} is required`)
  }
  return value.trim()
}

export function validateCoordinates(lat: any, lng: any) {
  if (typeof lat !== 'number' || lat < -90 || lat > 90) {
    throw new Error('Valid latitude is required')
  }
  
  if (typeof lng !== 'number' || lng < -180 || lng > 180) {
    throw new Error('Valid longitude is required')
  }
}

export function sanitizeOptionalString(value: any): string | undefined {
  return value?.trim() || undefined
}

export function sanitizeOptionalNumber(value: any): number | undefined {
  return value ? parseFloat(value) : undefined
}


