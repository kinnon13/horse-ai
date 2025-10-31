// Flow.ts (35 lines) - Single responsibility: Main service request flow orchestration
import { ServiceRequestDetector } from './ServiceRequestDetector'
import { ServiceRequestParser, ServiceRequestIntent } from './ServiceRequestParser'
import { Creator } from './Creator'
import { ServiceRequestDispatcher } from './ServiceRequestDispatcher'
import { ServiceRequestResponseGenerator, ServiceRequestResponse } from './ServiceRequestResponseGenerator'
import { FlowHandlers } from './FlowHandlers'

export class Flow {
  static isServiceRequestIntent(message: string): boolean {
    return ServiceRequestDetector.isServiceRequestIntent(message)
  }

  static async processServiceRequest(
    message: string,
    userId: string,
    horseContext?: string
  ): Promise<ServiceRequestResponse> {
    
    await FlowHandlers.logServiceRequestReceived(userId, message)
    
    const intent = ServiceRequestParser.parseServiceRequest(message)
    const userTier = await FlowHandlers.checkUserTier(userId)
    
    if (userTier === 'free' || userTier === 'guest') {
      return ServiceRequestResponseGenerator.generateUpgradeResponse(intent)
    }
    
    const serviceRequest = await Creator.createServiceRequestWithAudit(intent, userId, horseContext)
    const dispatchResult = await ServiceRequestDispatcher.dispatchToProviders(serviceRequest.id, intent)
    
    await FlowHandlers.logProvidersDispatched(
      userId,
      serviceRequest.id,
      dispatchResult.providerCount,
      intent.serviceType
    )
    
    return ServiceRequestResponseGenerator.generateSuccessResponse(
      intent,
      serviceRequest.id,
      dispatchResult.providerCount
    )
  }
}
