// ResponseTemplates.ts (35 lines) - Single responsibility: Response message templates
import { ServiceRequestIntent } from './ServiceRequestParser'

export class ResponseTemplates {
  static generateUpgradeMessage(intent: ServiceRequestIntent): string {
    return `I can help you find ${intent.serviceType} in ${intent.location.city}, but I need to upgrade you to HorseGPT+ to dispatch providers.\n\nHorseGPT+ gives you:\n• Direct provider dispatch\n• Emergency escalation\n• Priority support\n• Route safety alerts\n\nWant me to upgrade you for $19.99/month?`
  }

  static generateSuccessMessage(
    intent: ServiceRequestIntent,
    serviceRequestId: string,
    providerCount: number
  ): string {
    return `Got it - I'm dispatching ${intent.serviceType} providers in ${intent.location.city}, ${intent.location.state}. You should hear from someone within 30 minutes.\n\nI'll check back with you in 2 hours to make sure everything went well.`
  }

  static generateErrorMessage(error: string): string {
    return `Sorry, I had trouble processing your ${error} request. Please try again or contact support.`
  }

  static generateConfirmationMessage(serviceType: string, location: string): string {
    return `Just to confirm - you need a ${serviceType} in ${location}? I'll start looking for providers now.`
  }
}


