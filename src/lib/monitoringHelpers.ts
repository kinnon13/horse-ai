// monitoringHelpers.ts - Helper functions for monitoring
export function enrichErrorContext(
  context?: Record<string, any>
): Record<string, any> {
  if (!context) return {}

  return {
    ...context,
    timestamp: new Date().toISOString(),
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
    url: typeof window !== 'undefined' ? window.location.href : undefined
  }
}

export function sanitizeData(data: any): any {
  if (!data || typeof data !== 'object') return data

  const sensitiveKeys = ['password', 'token', 'secret', 'key', 'auth']
  const sanitized: Record<string, any> = {}

  for (const [key, value] of Object.entries(data)) {
    const lowerKey = key.toLowerCase()
    if (sensitiveKeys.some(sk => lowerKey.includes(sk))) {
      sanitized[key] = '[REDACTED]'
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeData(value)
    } else {
      sanitized[key] = value
    }
  }

  return sanitized
}

