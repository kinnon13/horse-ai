// Logging utility for events
export function logEvent(event: string, data?: any) {
  console.log(`Event: ${event}`, data)
}

export const CRITICAL_EVENTS = {
  USER_SIGNUP: 'user_signup',
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout',
  DATA_IMPORT: 'data_import',
  DATA_EXPORT: 'data_export',
  PAYMENT_SUCCESS: 'payment_success',
  PAYMENT_FAILED: 'payment_failed'
} as const
