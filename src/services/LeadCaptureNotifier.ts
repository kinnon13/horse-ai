// LeadCaptureNotifier.ts (10 lines) - Lead notification service
import { ServiceRequest } from './LeadCaptureTypes'

export async function sendLeadEmail(request: ServiceRequest) {
  console.log('Sending lead email for:', request)
  return { success: true }
}