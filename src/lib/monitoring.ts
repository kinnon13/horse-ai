// monitoring.ts - Sentry monitoring service
import * as Sentry from '@sentry/nextjs'
import { enrichErrorContext, sanitizeData } from './monitoringHelpers'

let isInitialized = false

export function initMonitoring(options?: {
  dsn?: string
  environment?: string
  tracesSampleRate?: number
}) {
  if (isInitialized) return
  const dsn = options?.dsn || process.env.NEXT_PUBLIC_SENTRY_DSN
  if (!dsn) {
    console.warn('Sentry DSN not configured')
    return
  }
  Sentry.init({
    dsn,
    environment: options?.environment || process.env.NODE_ENV || 'development',
    tracesSampleRate: options?.tracesSampleRate || 0.1,
    beforeSend: (event) => sanitizeData(event) as typeof event
  })
  isInitialized = true
}

export function logError(error: Error | string, context?: Record<string, any>) {
  if (!isInitialized) {
    console.error('Monitoring not initialized:', error, context)
    return
  }
  Sentry.captureException(typeof error === 'string' ? new Error(error) : error, {
    extra: enrichErrorContext(context)
  })
}

export function logEvent(event: string, data?: Record<string, any>) {
  if (!isInitialized) return 
  Sentry.captureMessage(event, {
    level: 'info',
    extra: sanitizeData(data || {})
  })
}

export function trackPerformance(metric: string, value: number) {
  if (!isInitialized) return
  Sentry.metrics.distribution(metric, value)
}
