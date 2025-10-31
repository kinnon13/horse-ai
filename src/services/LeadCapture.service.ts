// LeadCapture.service.ts (15 lines) - Main lead capture service coordinator
export type { ServiceRequest } from './LeadCaptureTypes'
export { extractServiceRequests } from './LeadCaptureExtractor'
export { sendLeadEmail } from './LeadCaptureNotifier'