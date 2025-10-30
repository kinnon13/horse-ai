/**
 * SERVICE REQUEST RESPONSE GENERATOR
 * 
 * PURPOSE:
 * - Generates appropriate responses for service requests
 * - Handles tier gating and upgrade prompts
 * - Provides clear next steps for users
 * 
 * SAFETY:
 * - We gate sensitive information behind Plus tier
 * - We log every general answer for audit trail
 * - We never expose private contact info without explicit consent
 */

import { ServiceRequestIntent } from './ServiceRequestParser'

export interface ServiceRequestResponse {
  message: string
  serviceRequest?: {
    id: string
    status: string
    estimatedProviders: number
  }
  requiresUpgrade?: boolean
  upgradeAction?: string
}

export class ServiceRequestResponseGenerator {
  static generateUpgradeResponse(intent: ServiceRequestIntent): ServiceRequestResponse {
    return {
      message: `I can help you find ${intent.serviceType} in ${intent.location.city}, but I need to upgrade you to HorseGPT+ to dispatch providers.\n\nHorseGPT+ gives you:\n• Direct provider dispatch\n• Emergency escalation\n• Priority support\n• Route safety alerts\n\nWant me to upgrade you for $19.99/month?`,
      requiresUpgrade: true,
      upgradeAction: 'ios_plus'
    }
  }

  static generateSuccessResponse(
    intent: ServiceRequestIntent,
    serviceRequestId: string,
    providerCount: number
  ): ServiceRequestResponse {
    return {
      message: `Got it - I'm dispatching ${intent.serviceType} providers in ${intent.location.city}, ${intent.location.state}. You should hear from someone within 30 minutes.\n\nI'll check back with you in 2 hours to make sure everything went well.`,
      serviceRequest: {
        id: serviceRequestId,
        status: 'dispatched',
        estimatedProviders: providerCount
      }
    }
  }
}




// --- AUTO-ADDED STUB EXPORTS (safe to replace with real code) ---
export function ServiceRequestResponse(_props?: any): never { throw new Error("Stubbed component used: ./ServiceRequestResponseGenerator.ServiceRequestResponse"); }
