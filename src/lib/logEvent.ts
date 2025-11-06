// Logging utility for events
export function logEvent(event: string, data?: any) {

}

export const CRITICAL_EVENTS = {
  USER_SIGNUP: 'user_signup',
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout',
  DATA_IMPORT: 'data_import',
  DATA_EXPORT: 'data_export',
  PAYMENT_SUCCESS: 'payment_success',
  PAYMENT_FAILED: 'payment_failed',
  FUNNEL_PATCH_APPLIED: 'funnel_patch_applied',
  BOOKING_CONFLICT: 'booking_conflict',
  BOOKING_HELD: 'booking_held',
  BOOKING_CONFIRMED: 'booking_confirmed',
  JOB_DISPATCHED: 'job_dispatched',
  JOB_UNFILLED: 'job_unfilled'
} as const

