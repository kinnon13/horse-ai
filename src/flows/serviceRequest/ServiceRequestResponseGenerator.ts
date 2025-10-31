// ServiceRequestResponseGenerator.ts (40 lines) - Single responsibility: Response generation logic
import { ServiceRequestIntent } from './ServiceRequestParser'
import { ResponseTemplates } from './ResponseTemplates'

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
      message: ResponseTemplates.generateUpgradeMessage(intent),
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
      message: ResponseTemplates.generateSuccessMessage(intent, serviceRequestId, providerCount),
      serviceRequest: {
        id: serviceRequestId,
        status: 'dispatched',
        estimatedProviders: providerCount
      }
    }
  }

  static generateErrorResponse(error: string): ServiceRequestResponse {
    return {
      message: ResponseTemplates.generateErrorMessage(error)
    }
  }

  static generateConfirmationResponse(serviceType: string, location: string): ServiceRequestResponse {
    return {
      message: ResponseTemplates.generateConfirmationMessage(serviceType, location)
    }
  }
}